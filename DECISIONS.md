# Decisions Log

Defaults and choices made during implementation. Each entry: when, where, why.

## Stage 1: KML parser

- **Python 3.11+**, managed with `uv`. Single workspace at the repo root for now; per-package `pyproject.toml` will be added when packages grow non-trivial. Initial layout uses `packages/kml-parser/` as an importable package, with shared dev tooling in the root.
- **KML parsing**: `lxml` for robustness against namespaces and malformed input.
- **Projection**: `pyproj`. UTM zone auto-detected from the centroid of all geometry in the file. WGS84 (EPSG:4326) → UTM (EPSG:326xx northern / 327xx southern). One zone per hole; cross-zone holes are rejected.
- **UTM origin**: We translate UTM coordinates by subtracting the centroid of all features so local coordinates stay near zero (improves numerical precision and makes JSON readable). The translation vector is stored as `utm_origin_m`. Absolute UTM = local + origin.
- **Defaults**:
  - `firmness`: 0.7 if not specified.
  - `rough_length_in`: omitted unless specified (only meaningful for rough zones).
  - `tree.radius_ft`: 6.0 ft (~1.8 m).
  - `tree.height_ft`: 50.0 ft (~15.2 m).
  - `tree.density`: 0.5.
  - `par`: 4 if not specified on the tee placemark.
- **Units**: All output in meters. Input lengths (`rough_length_in`, `radius_ft`, `height_ft`) converted on parse. ExtendedData parsing is permissive — accept either `<Data name="x"><value>y</value></Data>` or `<SimpleData name="x">y</SimpleData>`.
- **Zone vocabulary**: `tee | fairway | first_cut | rough | deep_rough | green | fringe | sand | water | oob | tree | cup`. Anything else raises with a clear message listing valid values.
- **Tee / cup**: point placemarks. The hole's tee/cup are the points whose `hole_number` matches the file's primary hole, or the only ones if there's no ambiguity.
- **Hole number**: determined from the tee placemark's `hole_number` field, falling back to the cup's, falling back to 1.
- **Target line**: optional LineString placemark with `zone=target_line`. If absent, defaults to a straight segment from tee to cup.
- **Elevation grid**: NOT populated in Stage 1. The field is omitted from `hole.json` until Stage 2 builds it from DEM.
- **Polygon winding / holes**: outer ring only for now. Inner rings (donut polygons) ignored with a warning. Revisit if any real-world hole needs them.
