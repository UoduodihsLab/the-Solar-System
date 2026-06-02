# The Solar System

[Chinese version](README_zh.md)

A high-performance 3D solar system simulation built for the web with Vite, React, TypeScript, and Three.js.

The project presents the solar system as an explorable spatial model instead of a flat educational diagram. Planets and moons rotate and orbit, distant small-body structures remain navigable through visual scale compression, and the whole scene can be explored from a wide god's-eye perspective.

## Features

- Full-screen 3D scene powered by React Three Fiber.
- Sun, eight planets, major moons, dwarf planets, rings, irregular satellite clouds, and small-body populations.
- Planetary rotation and orbital motion, including eccentricity, inclination, node direction, periapsis argument, phase, and retrograde motion where configured.
- Procedural shader materials for the Sun, rocky planets, gas giants, ice giants, moons, and dwarf bodies.
- Solar activity visuals including animated surface flow, corona, prominences, bloom, and emissive lighting.
- Small-body structures including the asteroid belt, Jupiter Trojans, Kuiper belt, scattered disc, comet streams, and Oort cloud.
- Camera controls with zoom, orbit, drag navigation, target focusing, WASD/arrow-key movement, Q/E vertical movement, and Shift acceleration.
- HUD controls for playback, simulation speed, timeline reset/scrub, target selection, focus, labels, orbit lines, and selected-object metadata.

## Tech Stack

- Vite
- React 19
- TypeScript
- Three.js
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing
- lucide-react
- Vitest

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

- `src/main.tsx` mounts the React application.
- `src/App.tsx` combines the 3D scene and HUD state.
- `src/components/SolarSystemScene.tsx` creates the canvas, lighting, postprocessing, camera rig, space environment, and solar system root.
- `src/components/CelestialBodyNode.tsx` renders bodies recursively, including rotation, orbit placement, labels, rings, atmospheres, selection halos, and child bodies.
- `src/components/ProceduralMaterials.tsx` contains the shader-based surface and solar visual effects.
- `src/components/Hud.tsx` provides simulation controls and selected-target information.
- `src/components/CameraRig.tsx` handles camera focusing and free navigation.
- `src/data/solarSystem.ts` is the central catalog for bodies, moons, small-body populations, satellite counts, and future scene layer IDs.
- `src/lib/orbits.ts` implements orbital math.
- `src/lib/scale.ts` maps real astronomical distances and radii into readable scene units.
- `src/lib/time.ts` handles simulation time and formatting.

## Simulation Model

The scene uses a visual scale rather than a strict real-world scale. Inner solar system distances are mapped linearly in AU, while remote structures are logarithmically compressed so the Kuiper belt, scattered disc, and Oort cloud remain visible and navigable. Body radii are also scaled nonlinearly so small moons and dwarf planets remain legible.

The simulation epoch is fixed at `2026-06-02 UTC`. Time advances according to the selected `daysPerSecond` value in the HUD.

## Current Scope

The current implementation focuses on the natural solar system:

- Sun and eight planets
- Planetary self-rotation and revolution
- Major moons and represented satellite populations
- Planetary rings
- Dwarf planets and distant small-body structures
- Visual indication of the solar system's motion relative to the galactic center direction

Future work should preserve the existing selection, focus, time, and scale systems while improving astronomical detail, rendering fidelity, and navigation performance.

## Verification

The current project state has been verified with:

```bash
npm test
npm run build
```

`npm run build` may show Vite's default warning about the main JavaScript chunk being larger than 500 kB. That warning is expected for the current 3D dependency set and does not mean the build failed.
