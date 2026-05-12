"""Unified hole JSON schema, defined as dataclasses with dict round-trip."""
from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Optional


POLYGON_ZONES = {
    "tee",
    "fairway",
    "first_cut",
    "rough",
    "deep_rough",
    "green",
    "fringe",
    "sand",
    "water",
    "oob",
}
POINT_ZONES = {"tee", "cup", "tree"}
LINE_ZONES = {"target_line"}
ALL_ZONES = POLYGON_ZONES | POINT_ZONES | LINE_ZONES


@dataclass
class Polygon:
    zone: str
    vertices: list[list[float]]
    firmness: float = 0.7
    rough_length_in: Optional[float] = None
    name: Optional[str] = None


@dataclass
class Tree:
    center: list[float]
    radius_m: float
    height_m: float
    density: float


@dataclass
class Hole:
    hole_number: int
    par: int
    utm_zone: int
    utm_hemisphere: str  # "N" or "S"
    utm_origin_m: list[float]
    tee: list[float]
    cup: list[float]
    target_line: list[list[float]]
    polygons: list[Polygon] = field(default_factory=list)
    trees: list[Tree] = field(default_factory=list)
    elevation_grid: Optional[dict] = None

    def to_dict(self) -> dict:
        return asdict(self)
