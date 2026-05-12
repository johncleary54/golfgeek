"""One-shot generator for tests/fixtures/test_hole.kml.

Builds a realistic ~370yd par 4 in a local meter frame, then projects to lon/lat
around a reference point so the KML is geographically valid.

Run: python _build_test_hole.py
"""
from __future__ import annotations

import math
from pathlib import Path

LAT0 = 40.0
LON0 = -76.0
M_PER_DEG_LAT = 111320.0
M_PER_DEG_LON = 111320.0 * math.cos(math.radians(LAT0))
YD_TO_M = 0.9144


def to_ll(x_m: float, y_m: float) -> tuple[float, float]:
    lat = LAT0 + y_m / M_PER_DEG_LAT
    lon = LON0 + x_m / M_PER_DEG_LON
    return lon, lat


def coords_str(pts_m: list[tuple[float, float]], close: bool = False) -> str:
    pts = list(pts_m)
    if close and pts[0] != pts[-1]:
        pts.append(pts[0])
    parts = []
    for x, y in pts:
        lon, lat = to_ll(x, y)
        parts.append(f"{lon:.9f},{lat:.9f},0")
    return " ".join(parts)


def circle(cx: float, cy: float, r: float, n: int = 24) -> list[tuple[float, float]]:
    return [
        (cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n))
        for i in range(n)
    ]


# ---------- Hole layout, all in local meters ----------

HOLE_LEN_YD = 370.0
HOLE_LEN_M = HOLE_LEN_YD * YD_TO_M  # 338.3 m
FAIRWAY_HALFWIDTH_M = 30.0 * YD_TO_M / 2  # 30yd wide → ±13.7m
GREEN_RADIUS_M = 25.0 * YD_TO_M / 2  # 25yd diameter → 11.4m

tee = (0.0, 0.0)
cup = (HOLE_LEN_M, 0.0)

# Rough: large outer area (acts as background).
rough = [
    (-15, -40), (HOLE_LEN_M + 25, -40),
    (HOLE_LEN_M + 25, 40), (-15, 40),
]

# Fairway: rectangle from 10m past tee to 25m before green.
fairway = [
    (10, -FAIRWAY_HALFWIDTH_M), (HOLE_LEN_M - 25, -FAIRWAY_HALFWIDTH_M),
    (HOLE_LEN_M - 25, FAIRWAY_HALFWIDTH_M), (10, FAIRWAY_HALFWIDTH_M),
]

# Green: circle around cup.
green = circle(cup[0], cup[1], GREEN_RADIUS_M, n=24)

# Two greenside bunkers.
bunker_left = circle(cup[0] - 8, cup[1] + 13, 4.5, n=16)
bunker_right = circle(cup[0] + 6, cup[1] - 12, 4.0, n=16)

# Water hazard along the right side around 200m.
water = [
    (180, -38), (240, -38), (240, -20), (180, -20),
]

# Three trees.
trees = [
    (150, 26, 6.0, 55.0, 0.6),
    (180, -32, 7.0, 50.0, 0.5),
    (260, 22, 5.0, 45.0, 0.4),
]


def style_polygon(name: str, zone: str, pts: list[tuple[float, float]], **kv) -> str:
    extdata = "\n".join(
        f'      <Data name="{k}"><value>{v}</value></Data>' for k, v in kv.items()
    )
    return f"""  <Placemark>
    <name>{name}</name>
    <ExtendedData>
      <Data name="zone"><value>{zone}</value></Data>
{extdata}
    </ExtendedData>
    <Polygon><outerBoundaryIs><LinearRing><coordinates>
      {coords_str(pts, close=True)}
    </coordinates></LinearRing></outerBoundaryIs></Polygon>
  </Placemark>"""


def style_point(name: str, zone: str, pt: tuple[float, float], **kv) -> str:
    extdata = "\n".join(
        f'      <Data name="{k}"><value>{v}</value></Data>' for k, v in kv.items()
    )
    lon, lat = to_ll(*pt)
    return f"""  <Placemark>
    <name>{name}</name>
    <ExtendedData>
      <Data name="zone"><value>{zone}</value></Data>
{extdata}
    </ExtendedData>
    <Point><coordinates>{lon:.9f},{lat:.9f},0</coordinates></Point>
  </Placemark>"""


def style_line(name: str, zone: str, pts: list[tuple[float, float]]) -> str:
    return f"""  <Placemark>
    <name>{name}</name>
    <ExtendedData>
      <Data name="zone"><value>{zone}</value></Data>
    </ExtendedData>
    <LineString><coordinates>
      {coords_str(pts)}
    </coordinates></LineString>
  </Placemark>"""


def build() -> str:
    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<kml xmlns="http://www.opengis.net/kml/2.2">',
        "<Document><name>Test Hole 1</name>",
        style_point("Tee 1", "tee", tee, hole_number=1, par=4),
        style_point("Cup 1", "cup", cup, hole_number=1),
        style_line("Target line", "target_line", [tee, (180, 0), cup]),
        style_polygon("Rough", "rough", rough, firmness=0.6, rough_length_in=2.5),
        style_polygon("Fairway", "fairway", fairway, firmness=0.85),
        style_polygon("Green", "green", green, firmness=0.9),
        style_polygon("Greenside bunker left", "sand", bunker_left, firmness=0.4),
        style_polygon("Greenside bunker right", "sand", bunker_right, firmness=0.4),
        style_polygon("Water hazard", "water", water),
    ]
    for i, (x, y, r_ft, h_ft, d) in enumerate(trees, 1):
        parts.append(
            style_point(
                f"Tree {i}", "tree", (x, y),
                radius_ft=r_ft, height_ft=h_ft, density=d,
            )
        )
    parts.append("</Document></kml>")
    return "\n".join(parts)


if __name__ == "__main__":
    out = Path(__file__).parent / "test_hole.kml"
    out.write_text(build())
    print(f"Wrote {out}")
