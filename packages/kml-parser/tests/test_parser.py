"""Tests for kml_parser."""
from __future__ import annotations

import math
from collections import Counter
from pathlib import Path

import pytest
from pyproj import Transformer

from kml_parser import parse_kml_file
from kml_parser.parser import ParseError, parse_kml
from kml_parser.schema import POLYGON_ZONES

FIXTURES = Path(__file__).parent / "fixtures"
TEST_HOLE = FIXTURES / "test_hole.kml"

# Expected dimensions from the fixture generator.
YD_TO_M = 0.9144
EXPECTED_HOLE_LEN_M = 370.0 * YD_TO_M  # 338.3 m


@pytest.fixture(scope="module")
def hole():
    return parse_kml_file(TEST_HOLE)


def test_basic_metadata(hole):
    assert hole.hole_number == 1
    assert hole.par == 4
    assert hole.utm_zone == 18  # lon=-76 → zone 18
    assert hole.utm_hemisphere == "N"


def test_tee_cup_identified_and_distance(hole):
    dist = math.hypot(hole.cup[0] - hole.tee[0], hole.cup[1] - hole.tee[1])
    assert dist == pytest.approx(EXPECTED_HOLE_LEN_M, rel=0.01)


def test_target_line(hole):
    # Fixture has a 3-point target line through (180, 0).
    assert len(hole.target_line) == 3


@pytest.mark.parametrize(
    "zone,expected_count",
    [
        ("fairway", 1),
        ("rough", 1),
        ("green", 1),
        ("sand", 2),
        ("water", 1),
    ],
)
def test_polygon_zone_round_trip(hole, zone, expected_count):
    counts = Counter(p.zone for p in hole.polygons)
    assert counts[zone] == expected_count


def test_all_polygon_zones_are_valid(hole):
    for p in hole.polygons:
        assert p.zone in POLYGON_ZONES


def test_trees(hole):
    assert len(hole.trees) == 3
    # Trees: radius_ft 6/7/5, height_ft 55/50/45, density 0.6/0.5/0.4
    by_density = sorted(hole.trees, key=lambda t: t.density)
    assert by_density[0].density == pytest.approx(0.4)
    assert by_density[-1].density == pytest.approx(0.6)
    # Spot-check unit conversion: 6 ft → 1.8288 m.
    radii = sorted(t.radius_m for t in hole.trees)
    assert radii[0] == pytest.approx(5 * 0.3048, rel=1e-6)
    assert radii[-1] == pytest.approx(7 * 0.3048, rel=1e-6)
    # Heights: 45/50/55 ft → m.
    heights = sorted(t.height_m for t in hole.trees)
    assert heights[0] == pytest.approx(45 * 0.3048, rel=1e-6)
    assert heights[-1] == pytest.approx(55 * 0.3048, rel=1e-6)


def test_fairway_firmness_and_defaults(hole):
    fw = next(p for p in hole.polygons if p.zone == "fairway")
    assert fw.firmness == pytest.approx(0.85)
    assert fw.rough_length_in is None

    rough = next(p for p in hole.polygons if p.zone == "rough")
    assert rough.rough_length_in == pytest.approx(2.5)


def test_utm_projection_is_reversible(hole):
    """Re-project local UTM tee back to lon/lat and confirm it lands near the
    fixture's reference lat/lon (LAT0=40, LON0=-76)."""
    epsg = 32600 + hole.utm_zone
    transformer = Transformer.from_crs(f"EPSG:{epsg}", "EPSG:4326", always_xy=True)
    abs_x = hole.tee[0] + hole.utm_origin_m[0]
    abs_y = hole.tee[1] + hole.utm_origin_m[1]
    lon, lat = transformer.transform(abs_x, abs_y)
    assert lon == pytest.approx(-76.0, abs=1e-4)
    assert lat == pytest.approx(40.0, abs=1e-4)


def test_local_frame_is_centered(hole):
    """All coordinates should be roughly centered around the origin in the
    local frame (max magnitude < ~500 m for a ~340 m hole)."""
    all_pts = [hole.tee, hole.cup] + [v for p in hole.polygons for v in p.vertices]
    max_mag = max(math.hypot(x, y) for x, y in all_pts)
    assert max_mag < 500


def test_unknown_zone_raises():
    bad = b"""<?xml version="1.0"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document>
  <Placemark><name>Tee</name>
    <ExtendedData><Data name="zone"><value>tee</value></Data></ExtendedData>
    <Point><coordinates>-76.0,40.0,0</coordinates></Point>
  </Placemark>
  <Placemark><name>Cup</name>
    <ExtendedData><Data name="zone"><value>cup</value></Data></ExtendedData>
    <Point><coordinates>-76.001,40.0,0</coordinates></Point>
  </Placemark>
  <Placemark><name>Bad</name>
    <ExtendedData><Data name="zone"><value>quicksand</value></Data></ExtendedData>
    <Polygon><outerBoundaryIs><LinearRing><coordinates>
      -76.0,40.0,0 -76.0001,40.0,0 -76.0001,40.0001,0 -76.0,40.0,0
    </coordinates></LinearRing></outerBoundaryIs></Polygon>
  </Placemark>
</Document></kml>"""
    with pytest.raises(ParseError, match="unknown zone"):
        parse_kml(bad)


def test_missing_tee_raises():
    bad = b"""<?xml version="1.0"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document>
  <Placemark><name>Cup</name>
    <ExtendedData><Data name="zone"><value>cup</value></Data></ExtendedData>
    <Point><coordinates>-76.0,40.0,0</coordinates></Point>
  </Placemark>
</Document></kml>"""
    with pytest.raises(ParseError, match="No tee"):
        parse_kml(bad)


def test_to_dict_is_json_serializable(hole):
    import json
    s = json.dumps(hole.to_dict())
    assert '"hole_number": 1' in s
    assert '"polygons"' in s
    assert '"trees"' in s
