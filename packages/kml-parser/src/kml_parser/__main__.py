"""CLI: python -m kml_parser parse <input.kml> --out <hole.json>."""
from __future__ import annotations

import argparse
import json
import math
import sys
from collections import Counter
from pathlib import Path

from shapely.geometry import Polygon as ShPoly

from kml_parser.parser import parse_kml_file
from kml_parser.schema import Hole


def _summary(hole: Hole) -> str:
    zones = Counter(p.zone for p in hole.polygons)
    total_area = 0.0
    for p in hole.polygons:
        try:
            total_area += ShPoly(p.vertices).area
        except Exception:
            pass
    tee_to_cup = math.hypot(
        hole.cup[0] - hole.tee[0], hole.cup[1] - hole.tee[1]
    )
    lines = [
        f"Hole {hole.hole_number} (par {hole.par})",
        f"  UTM zone: {hole.utm_zone}{hole.utm_hemisphere}",
        f"  Tee→Cup: {tee_to_cup:.1f} m ({tee_to_cup * 1.0936:.1f} yd)",
        f"  Polygons: {sum(zones.values())}  " + ", ".join(f"{k}={v}" for k, v in sorted(zones.items())),
        f"  Trees: {len(hole.trees)}",
        f"  Total polygon area: {total_area:.0f} m²",
    ]
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="kml-parser")
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_parse = sub.add_parser("parse", help="Parse a KML file to hole JSON")
    p_parse.add_argument("input", type=Path)
    p_parse.add_argument("--out", type=Path, required=True)
    args = parser.parse_args(argv)

    if args.cmd == "parse":
        hole = parse_kml_file(args.input)
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(hole.to_dict(), indent=2))
        print(_summary(hole))
        print(f"Wrote {args.out}")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
