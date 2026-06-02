# Project Overview

This project is named The Solar System. It uses Vite, React, and TypeScript to build an explorable web-based 3D model of the solar system. The current code implements phase one: a high-performance 3D scene for the natural solar system.

The goal is not a conventional educational solar system diagram. It is a scalable, focusable spatial model that can be explored from a god's-eye view in the browser. Planets and moons rotate and orbit, and the solar system as a whole visually expresses motion relative to the galactic center direction.

## Current Code Facts

- Tech stack: Vite, React 19, TypeScript, Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing, lucide-react, and Vitest.
- Entry point: `src/main.tsx` mounts the React app, and `src/App.tsx` combines the 3D scene with the HUD.
- Main scene: `src/components/SolarSystemScene.tsx` creates the R3F `Canvas`, lighting, Bloom/Vignette postprocessing, camera controls, starfield environment, small-body point clouds, and solar system root node.
- Solar system root node: `SolarSystemRoot` applies simulation-time-based translation and rotation to represent the solar system's motion relative to the galactic center direction.
- Camera: `src/components/CameraRig.tsx` uses drei `CameraControls` and supports target focusing, zooming, drag navigation, WASD/arrow-key movement, Q/E vertical movement, and Shift acceleration.
- HUD: `src/components/Hud.tsx` supports play/pause, time reset, timeline control, speed selection, target selection, focus, label visibility, orbit-line visibility, and a target information panel.
- Celestial data: `src/data/solarSystem.ts` is the core data source. It includes the Sun, eight planets, major moons, dwarf planets, small-body populations, and the `futureExternalLayers` placeholder for future scene layers.
- Satellite representation: major moons are modeled as explicit celestial bodies. Jupiter, Saturn, Uranus, and Neptune also use irregular satellite point clouds to complete the known satellite counts. Tests require `representedSatelliteCount` to match `knownPlanetarySatelliteCounts`.
- Orbit calculation: `src/lib/orbits.ts` supports Keplerian approximation, eccentricity, inclination, longitude of ascending node, argument of periapsis, phase, and retrograde motion.
- Scale system: `src/lib/scale.ts` maps the inner solar system linearly in AU and uses logarithmic compression for distant structures. Radii use visually readable nonlinear scaling and are not strict real-world proportions.
- Time system: `src/lib/time.ts` uses `2026-06-02 UTC` as the simulation epoch. `daysPerSecond` controls simulation advancement.
- Visual system: `src/components/ProceduralMaterials.tsx` uses procedural shaders for the Sun, rocky planets, gas and ice giants, icy bodies, rocky small bodies, and related surfaces. The Sun includes noise-driven surface flow, flare-like effects, corona, and prominences.
- Rings and clouds: `RingSystem` renders planetary rings, `OrbitLine` renders orbit lines, and `SmallBodyCloud` renders the asteroid belt, Jupiter Trojans, Kuiper belt, scattered disc, comet streams, and Oort cloud.
- Styling: `src/styles.css` contains global styles. The current UI is a dark glass-like HUD over a full-screen canvas.
- Tests: there are currently 4 Vitest test files covering the solar system catalog, orbital math, scale functions, and time functions.

## Development Principles

- Keep the implementation data-driven. When adding natural bodies, moons, or small-body populations, extend `src/data/solarSystem.ts` and `src/types.ts` first, then let existing components consume the data.
- Do not mix natural celestial bodies, future artificial structures, and UI state in the same abstraction layer. Future extensions should be connected as independent external layers or independent configuration and should register selectable/focusable targets.
- When adding heliocentric bodies, provide `semiMajorAxisAU`, `periodDays`, `eccentricity`, `inclinationDeg`, `longitudeOfAscendingNodeDeg`, `argumentOfPeriapsisDeg`, and `phaseDeg` whenever possible so the body stays aligned with the existing orbit model.
- When adding moons, use `semiMajorAxisKm` and parent-body radius conversion. Do not hand-code scene distances.
- Do not place real radii or real AU distances directly into Three.js coordinates. They must pass through the mapping functions in `scale.ts`, unless a deliberately new and tested scale system is being added.
- The Sun itself must continue to show rotation. The current Sun data already includes `rotation`, and the material layer also uses dynamic shaders, corona, and prominences to express solar activity.
- Prefer procedural materials, point clouds, shaders, and geometry for visuals. If textures or external assets are introduced, confirm loading paths, performance, and build output.
- R3F animation logic should live in `useFrame`. Large geometry, point clouds, and sampled points should use `useMemo` to avoid rebuilding them every frame.
- Keep the HUD as an auxiliary control layer. Do not let long explanatory text block the 3D view.
- After frontend visual changes, inspect the app in a browser and verify zooming, focusing, labels, orbit lines, movement controls, and mobile layout.

## Future Direction

Future work should continue to center on the solar system simulation itself:

- Improve the visual credibility of body surfaces, ring systems, satellite groups, and small-body structures.
- Improve scale readability, navigation experience, target focusing, and distant-structure legibility.
- Add clearly layered future-scene extensions without breaking the natural celestial model.

Implementation should prioritize reuse of the existing target registration, selection, focus, time advancement, and scale systems. New structures need clear spatial hierarchy, visual scale, interaction targets, and information panels, and must not break the phase-one natural celestial model.

## Common Commands

- Install dependencies: `npm install`
- Local development: `npm run dev`
- Tests: `npm test`
- Production build: `npm run build`
- Preview production build: `npm run preview`

Current code verification:

- `npm test` passes: 4 test files, 16 tests.
- `npm run build` passes. Vite may warn that the main JS chunk is larger than 500 kB; this is a known warning caused by the current 3D dependency size and does not indicate build failure.
