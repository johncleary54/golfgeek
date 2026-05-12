# Handoff to Next Session (new repo)

You're a fresh Claude Code session connected to the **new** golf-sg repo. The previous session lived in an older repo (`johncleary54/golfgeek`) and completed **Stage 1** of the plan. This doc tells you exactly what's done, what to do next, and the conventions to follow.

## Context

We're building a personalized Strokes Gained engine: hole geometry from Google Earth KML + a golfer's Trackman data → Monte Carlo simulation → SG vs PGA + personal baselines. Full plan lives in `PLAN.md` at the repo root (copy it over from the previous repo if it's not here yet — see "Bootstrapping a fresh repo" below).

The previous repo's old SvelteKit/PocketBase app is in `legacy/` and is NOT being deleted — it has data worth salvaging later (amateur skill distribution params, baseline H(d,c) tables, any hole polygon data).

## What Stage 1 produced (already done — don't redo)

In the previous repo, on branch `claude/explore-codebase-51pfB`:

- `PLAN.md`, `DECISIONS.md` at repo root
- `pyproject.toml` (uv workspace, members = `packages/*`)
- `packages/kml-parser/` — fully working package
  - `src/kml_parser/schema.py` — `Hole`, `Polygon`, `Tree` dataclasses; zone vocab
  - `src/kml_parser/parser.py` — KML → Hole; lxml + pyproj + shapely; auto UTM zone from centroid; local frame centered at projected centroid
  - `src/kml_parser/__main__.py` — CLI: `python -m kml_parser parse <in.kml> --out <out.json>`
  - `tests/fixtures/_build_test_hole.py` — generator for fixture
  - `tests/fixtures/test_hole.kml` — ~370yd par 4 (tee, cup, target line, fairway, rough, green, 2 bunkers, water, 3 trees)
  - `tests/test_parser.py` — 16 passing tests
- `data/holes/`, `data/trackman/`, `data/benchmarks/` directory skeletons

Sample CLI output: `Hole 1 (par 4), UTM 18N, Tee→Cup 338.7m (370.4yd), 6 polygons, 3 trees, total area 40111 m².`

## Bootstrapping a fresh repo

If the new repo is empty (or missing the Stage 1 work), the user can copy it over from the previous repo. **Ask the user**:

> "Is `packages/kml-parser/` and `PLAN.md` already in this repo, or do you need me to recreate Stage 1 here?"

If they need it recreated, the previous repo's Stage 1 commit is on branch `claude/explore-codebase-51pfB`. Easiest path: have them clone the previous repo and copy:
- `PLAN.md`, `DECISIONS.md`, `pyproject.toml`, `.gitignore`
- `packages/kml-parser/` (entire directory)
- `data/holes/.gitkeep`
- `legacy/` (the archived old app — large, optional)

Then `uv sync` and `uv run pytest packages/kml-parser` to confirm green.

## Conventions to follow

- **Language**: Python 3.11+, managed by `uv`. Workspace at repo root, packages under `packages/`.
- **Units**: All internal math in meters. KML lat/lon inputs convert at parse. Trackman yards → meters at ingest.
- **Coords**: Local UTM frame, centered at projected centroid of all hole features. `utm_origin_m` field on `Hole` is the offset back to absolute UTM.
- **Logging decisions**: Anything ambiguous, pick a sensible default and append to `DECISIONS.md` with a short rationale. Don't stop to ask questions on minor defaults.
- **Tests**: `pytest`, fixtures under `tests/fixtures/`. Always run tests before committing.
- **Commits**: One commit per stage, descriptive body. Develop on a feature branch (ask the user what branch they want, or default to `claude/stage-N-<short-name>`).
- **No emojis** anywhere.
- **No comments** unless the WHY is non-obvious — well-named identifiers are enough.

## Stage 2: what to build next

**Goal**: Given a `hole.json`, answer "what's at (x, y)?", "what's the slope at (x, y)?", and "does this line segment hit a tree?".

Create `packages/hole-model/` as the next package. Spec:

1. **Loader**: `load_hole(path) -> HoleModel`. Reads `hole.json` (output of kml-parser) and wraps it with Shapely geometries and an STRtree index.
2. **Zone classification**: `model.zone_at(x, y) -> str`. Point-in-polygon via Shapely's `STRtree` for speed. If a point lies in multiple non-tree polygons, use a precedence ordering (more-specific zones win — e.g. `green` over `fringe` over `fairway` over `rough`). Trees overlap other zones; `zone_at` returns the underlying terrain, not "tree". A separate `model.trees_hitting_segment(p0, p1) -> list[Tree]` handles tree intersection.
3. **Elevation**: Stage 2a — accept a DEM file path in `hole.json` and bilinear-sample. Stage 2b — auto-download SRTM 30m tiles for the bounding box if no DEM given. Start with 2a; add 2b only if straightforward (use `elevation` or `rasterio` + a public SRTM endpoint).
4. **Slope**: Finite-difference gradient of the elevation grid. `model.slope_at(x, y) -> (dz_dx, dz_dy)` in meters/meter.
5. **Tree intersection**: For a 2D line segment, check each tree's circular footprint via Shapely; return all hits. (Height check / trajectory arc comes in Stage 4 — Stage 2 only needs 2D geometric intersection.)
6. **Tests**: `tests/test_hole_model.py` — use the same fixture from kml-parser. Test: point in fairway returns `"fairway"`, point in green returns `"green"`, point in water returns `"water"`, point clearly outside everything returns `"oob"` or `None` (decide and log). Segment crossing through tree returns that tree. Elevation/slope tests use a synthetic constant-grade DEM (just write a small numpy array, no real DEM download in tests).
7. **README** documenting the API.

**Dependencies**: add `numpy` (already in lockfile via pyproj) and `shapely` to the package's pyproject. If you do DEM auto-download, add `rasterio` — but gate it behind an optional extra so the core install stays light.

## Don't do

- Don't simulate shots yet (Stage 4).
- Don't compute SG yet (Stage 5).
- Don't build any UI (Stage 6).
- Don't add curved shot paths, wind, putt simulation, or course aggregation — all explicitly out for v1 (see PLAN.md).
- Don't touch `legacy/` — it stays as archive.

## Verification

When Stage 2 is done:

```bash
uv sync
uv run pytest packages/hole-model -v
```

Then commit, push, and report back to the user with:
- What landed (one short paragraph)
- New decisions logged in `DECISIONS.md`
- The next stage prompt to use: *"Read PLAN.md. Execute Stage 3 end to end."*

## Trackman data heads-up

The user has Trackman CSVs they'll want to ingest in Stage 3. If they offer to drop one in `data/trackman/` early so you can sanity-check column names before Stage 3, accept it but don't act on it until Stage 3.
