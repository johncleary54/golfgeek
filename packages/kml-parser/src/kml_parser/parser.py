"""KML → Hole parser.

Reads a Google Earth KML file containing placemarks with ExtendedData fields
describing zones, and produces a unified Hole object in a local UTM frame.
"""
from __future__ import annotations

import math
from pathlib import Path
from typing import Optional

from lxml import etree
from pyproj import Transformer

from kml_parser.schema import (
    ALL_ZONES,
    LINE_ZONES,
    POINT_ZONES,
    POLYGON_ZONES,
    Hole,
    Polygon,
    Tree,
)

KML_NS = "http://www.opengis.net/kml/2.2"
NSMAP = {"k": KML_NS}

FT_TO_M = 0.3048
IN_TO_M = 0.0254


class ParseError(ValueError):
    pass


# ---------- ExtendedData helpers ----------


def _ext_data(placemark: etree._Element) -> dict[str, str]:
    """Return ExtendedData fields as a flat string dict.

    Accepts both <Data name="x"><value>y</value></Data> and
    <SimpleData name="x">y</SimpleData>.
    """
    out: dict[str, str] = {}
    for data in placemark.findall(".//k:ExtendedData/k:Data", NSMAP):
        name = data.get("name")
        value_el = data.find("k:value", NSMAP)
        if name and value_el is not None and value_el.text is not None:
            out[name] = value_el.text.strip()
    for sd in placemark.findall(".//k:ExtendedData//k:SimpleData", NSMAP):
        name = sd.get("name")
        if name and sd.text is not None:
            out[name] = sd.text.strip()
    return out


def _get_zone(ext: dict[str, str], placemark: etree._Element) -> Optional[str]:
    zone = ext.get("zone")
    if zone is None:
        return None
    zone = zone.strip().lower()
    if zone not in ALL_ZONES:
        name = placemark.findtext("k:name", default="<unnamed>", namespaces=NSMAP)
        raise ParseError(
            f"Placemark {name!r}: unknown zone {zone!r}. "
            f"Valid values: {sorted(ALL_ZONES)}"
        )
    return zone


def _float(ext: dict[str, str], key: str, default: Optional[float] = None) -> Optional[float]:
    if key not in ext:
        return default
    try:
        return float(ext[key])
    except ValueError as e:
        raise ParseError(f"ExtendedData {key!r}={ext[key]!r} is not a number") from e


def _int(ext: dict[str, str], key: str, default: Optional[int] = None) -> Optional[int]:
    if key not in ext:
        return default
    try:
        return int(ext[key])
    except ValueError as e:
        raise ParseError(f"ExtendedData {key!r}={ext[key]!r} is not an int") from e


# ---------- Geometry helpers ----------


def _parse_coords(text: str) -> list[tuple[float, float]]:
    """Parse KML coordinates string into [(lon, lat), ...]. Ignores altitude."""
    pts: list[tuple[float, float]] = []
    for token in text.replace("\n", " ").split():
        parts = token.split(",")
        if len(parts) < 2:
            continue
        lon, lat = float(parts[0]), float(parts[1])
        pts.append((lon, lat))
    return pts


def _placemark_geometry(placemark: etree._Element) -> tuple[str, list[tuple[float, float]]]:
    """Return (geom_type, lonlat_points)."""
    pt = placemark.find(".//k:Point/k:coordinates", NSMAP)
    if pt is not None and pt.text:
        return "Point", _parse_coords(pt.text)
    ls = placemark.find(".//k:LineString/k:coordinates", NSMAP)
    if ls is not None and ls.text:
        return "LineString", _parse_coords(ls.text)
    poly_outer = placemark.find(
        ".//k:Polygon/k:outerBoundaryIs/k:LinearRing/k:coordinates", NSMAP
    )
    if poly_outer is not None and poly_outer.text:
        return "Polygon", _parse_coords(poly_outer.text)
    name = placemark.findtext("k:name", default="<unnamed>", namespaces=NSMAP)
    raise ParseError(f"Placemark {name!r} has no Point/LineString/Polygon geometry")


# ---------- UTM projection ----------


def _utm_zone_for(lon: float, lat: float) -> tuple[int, str]:
    zone = int(math.floor((lon + 180.0) / 6.0)) + 1
    hemi = "N" if lat >= 0 else "S"
    return zone, hemi


def _utm_epsg(zone: int, hemi: str) -> int:
    return (32600 if hemi == "N" else 32700) + zone


# ---------- Main parse ----------


def parse_kml_file(path: str | Path) -> Hole:
    with open(path, "rb") as f:
        return parse_kml(f.read())


def parse_kml(kml_bytes: bytes) -> Hole:
    root = etree.fromstring(kml_bytes)
    placemarks = root.findall(".//k:Placemark", NSMAP)
    if not placemarks:
        raise ParseError("KML contains no <Placemark> elements")

    # First pass: extract raw lon/lat geometries + metadata.
    raw: list[dict] = []
    for pm in placemarks:
        ext = _ext_data(pm)
        zone = _get_zone(ext, pm)
        if zone is None:
            # Skip placemarks without a zone tag — they're commentary/markers.
            continue
        geom_type, coords = _placemark_geometry(pm)
        raw.append(
            {
                "zone": zone,
                "geom_type": geom_type,
                "coords": coords,
                "ext": ext,
                "name": pm.findtext("k:name", default=None, namespaces=NSMAP),
            }
        )

    if not raw:
        raise ParseError("KML has placemarks but none with a 'zone' ExtendedData field")

    # Determine UTM zone from centroid of all coordinates.
    all_lons = [lon for r in raw for lon, _ in r["coords"]]
    all_lats = [lat for r in raw for _, lat in r["coords"]]
    centroid_lon = sum(all_lons) / len(all_lons)
    centroid_lat = sum(all_lats) / len(all_lats)
    utm_zone, hemi = _utm_zone_for(centroid_lon, centroid_lat)
    epsg = _utm_epsg(utm_zone, hemi)
    transformer = Transformer.from_crs("EPSG:4326", f"EPSG:{epsg}", always_xy=True)

    # Project everything to absolute UTM.
    for r in raw:
        r["utm"] = [transformer.transform(lon, lat) for lon, lat in r["coords"]]

    # Cross-zone check: warn if any coord is >3 degrees from the centroid longitude.
    for r in raw:
        for lon, _ in r["coords"]:
            if abs(lon - centroid_lon) > 3.0:
                raise ParseError(
                    f"Placemark {r['name']!r} spans multiple UTM zones; "
                    "split the file or pick a single zone manually."
                )

    # Choose origin as centroid of all projected points → translate to local frame.
    xs = [x for r in raw for x, _ in r["utm"]]
    ys = [y for r in raw for _, y in r["utm"]]
    origin_x = sum(xs) / len(xs)
    origin_y = sum(ys) / len(ys)
    for r in raw:
        r["local"] = [[x - origin_x, y - origin_y] for x, y in r["utm"]]

    # Find tee and cup point placemarks.
    tees = [r for r in raw if r["zone"] == "tee" and r["geom_type"] == "Point"]
    cups = [r for r in raw if r["zone"] == "cup" and r["geom_type"] == "Point"]
    if not tees:
        raise ParseError("No tee point placemark (zone=tee, Point geometry) found")
    if not cups:
        raise ParseError("No cup point placemark (zone=cup, Point geometry) found")

    # Hole number: tee's hole_number, else cup's, else 1.
    hole_number = (
        _int(tees[0]["ext"], "hole_number")
        or _int(cups[0]["ext"], "hole_number")
        or 1
    )
    par = _int(tees[0]["ext"], "par", 4) or 4

    # If multiple tees/cups in file, pick the matching hole_number.
    def _pick(items: list[dict]) -> dict:
        if len(items) == 1:
            return items[0]
        matching = [i for i in items if _int(i["ext"], "hole_number") == hole_number]
        if not matching:
            raise ParseError(
                f"Multiple {items[0]['zone']} markers and none match hole_number={hole_number}"
            )
        if len(matching) > 1:
            raise ParseError(
                f"Multiple {items[0]['zone']} markers match hole_number={hole_number}"
            )
        return matching[0]

    tee = _pick(tees)
    cup = _pick(cups)
    tee_pt = tee["local"][0]
    cup_pt = cup["local"][0]

    # Polygons.
    polygons: list[Polygon] = []
    for r in raw:
        if r["geom_type"] != "Polygon":
            continue
        if r["zone"] not in POLYGON_ZONES:
            # tee/cup/tree are points; target_line is a line. A polygon zone has to be a polygon zone.
            raise ParseError(
                f"Placemark {r['name']!r}: zone={r['zone']!r} is not a polygon zone"
            )
        polygons.append(
            Polygon(
                zone=r["zone"],
                vertices=r["local"],
                firmness=_float(r["ext"], "firmness", 0.7) or 0.7,
                rough_length_in=_float(r["ext"], "rough_length_in", None),
                name=r["name"],
            )
        )

    # Trees.
    trees: list[Tree] = []
    for r in raw:
        if r["zone"] != "tree":
            continue
        if r["geom_type"] != "Point":
            raise ParseError(f"Tree placemark {r['name']!r} must be a Point")
        radius_ft = _float(r["ext"], "radius_ft", 6.0) or 6.0
        height_ft = _float(r["ext"], "height_ft", 50.0) or 50.0
        density = _float(r["ext"], "density", 0.5) or 0.5
        trees.append(
            Tree(
                center=r["local"][0],
                radius_m=radius_ft * FT_TO_M,
                height_m=height_ft * FT_TO_M,
                density=density,
            )
        )

    # Target line.
    target_lines = [r for r in raw if r["zone"] == "target_line"]
    if target_lines:
        if target_lines[0]["geom_type"] != "LineString":
            raise ParseError("target_line placemark must be a LineString")
        target_line = target_lines[0]["local"]
    else:
        target_line = [tee_pt, cup_pt]

    return Hole(
        hole_number=hole_number,
        par=par,
        utm_zone=utm_zone,
        utm_hemisphere=hemi,
        utm_origin_m=[origin_x, origin_y],
        tee=tee_pt,
        cup=cup_pt,
        target_line=target_line,
        polygons=polygons,
        trees=trees,
        elevation_grid=None,
    )
