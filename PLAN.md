# Golf SG Engine — Project Plan

## What we're building

A personalized Strokes Gained engine. Inputs:

1. Hole geometry drawn in Google Earth, exported as KML, with per-zone properties (zone type, firmness, rough length, slope).
2. A golfer's Trackman data, fit into per-club shot distributions.

Outputs:

1. Monte Carlo simulation of rounds on a specific hole given a specific golfer.
2. Strokes Gained per shot, per club, per hole, vs both PGA Tour baseline and the golfer's own benchmark.
3. Strategy recommendations (target lines that minimize expected strokes).

This is a faithful, modernized rebuild of Broadie/Ko 2012, with the addition of personalized Trackman calibration.

## Architectural decisions, locked in

- **Language**: Python for the engine (numerical libs, MLE fitting). TypeScript for the viewer.
- **Hole editor**: Google Earth Pro (free) for drawing polygons. Properties live in KML `<ExtendedData>` per `<Placemark>` — set them inside Google Earth, no separate labeling tool needed.
- **Coordinate system**: KML is WGS84 lat/lon. Project to UTM (single zone per course) for all distance math. Use `pyproj`.
- **Elevation**: Download a DEM tile over the course bounding box (SRTM 30m globally; USGS 3DEP for higher res in US). Sample at a 1m grid. Do not rely on KML altitude values from Google Earth.
- **Zone classification**: Point-in-polygon via Shapely. Trees overlap other zones (per the thesis); zones otherwise non-overlapping.
- **Shot distributions**:
  - Long tee/driver: mixture of `N(μ_g, σ_g)` (good shot) + `t(μ_b, s_b, ν_b)` (bad shot), fit via EM.
  - Approach shots: truncated `t-location-scale` on relative distance error `X = l/d_c - 1`, lower-truncated at -1.
  - Side angle: `t-location-scale` for both, fit via MLE.
- **Strokes Gained baseline**: PGA Tour benchmark from Broadie tables (published, public) AS THE PRIMARY. Also compute a personal benchmark via 10k simulated rounds for the user's own distributions.
- **Renderer**: deck.gl over a satellite basemap for 2D top-down. Three.js + DEM mesh for 3D. Start 2D, add 3D in Stage 5.

## Repo structure

```
golf-sg/
├── packages/
│   ├── kml-parser/         # KML → unified hole JSON
│   ├── hole-model/         # Geometry, zone classification, slope grid, elevation sampling
│   ├── shot-distribution/  # Trackman ingest, per-club distribution fitting
│   ├── shot-simulator/     # Sample shot → apply carry/roll/slope/hazard rules
│   ├── sg-engine/          # Benchmark function H, SG computation, strategy optimizer
│   └── viewer/             # deck.gl + Three.js front-end
├── data/
│   ├── holes/              # *.kml, *.dem (cached elevation), *.json (unified)
│   ├── trackman/           # raw Trackman exports, CSV
│   └── benchmarks/         # PGA Tour SG tables
└── tests/
```

## Stages

### Stage 1: KML parser + unified hole JSON

Read KML from Google Earth, output a clean hole representation.

**KML conventions** (set these inside Google Earth per Placemark):

```xml
<Placemark>
  <name>15 fairway</name>
  <ExtendedData>
    <Data name="zone"><value>fairway</value></Data>      <!-- tee|fairway|first_cut|rough|deep_rough|green|fringe|sand|water|oob -->
    <Data name="firmness"><value>0.9</value></Data>       <!-- 0..1, default 0.7 -->
    <Data name="rough_length_in"><value>2.5</value></Data><!-- inches, optional -->
    <Data name="hole_number"><value>15</value></Data>
  </ExtendedData>
  <Polygon>...</Polygon>
</Placemark>
```

Trees are point placemarks with `zone=tree`, `radius_ft`, `height_ft`, `density` (0..1, tree-hit-per-yard prob).
Tee marker and cup marker are point placemarks with `zone=tee` and `zone=cup` respectively, plus `hole_number`.

**Output schema** (`hole.json`):

```json
{
  "hole_number": 15,
  "par": 4,
  "utm_zone": 17,
  "utm_origin_m": [x, y],
  "tee": [x_m, y_m],
  "cup": [x_m, y_m],
  "target_line": [[x,y],[x,y]],
  "polygons": [{"zone":"fairway","firmness":0.9,"vertices":[[x,y]]}],
  "trees": [{"center":[x,y],"radius_m":2.0,"height_m":18.0,"density":0.5}],
  "elevation_grid": {"origin":[x,y],"step_m":1.0,"shape":[w,h],"data_path":"hole15.dem"}
}
```

### Stage 2: Hole model + zone classification + slope/elevation
### Stage 3: Trackman ingestion + distribution fitting
### Stage 4: Shot simulator
### Stage 5: SG engine
### Stage 6: Viewer (deck.gl 2D, Three.js 3D)

## Explicitly NOT doing on day one

- Curved shot paths (slice/draw/fade/hook)
- Wind
- Putt simulation beyond a fixed model
- Multi-course / round aggregation UI

## Old app

Moved to `legacy/`. Salvage targets:
- Calibrated distribution parameters for amateur skill groups
- Any hole polygon data in XML/JSON
- Benchmark function tables H(d, c) if persisted
