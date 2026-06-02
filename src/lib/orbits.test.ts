import { describe, expect, it } from "vitest";
import type { OrbitConfig } from "../types";
import {
  orbitalPositionAU,
  orbitalPositionScene,
  orbitProgress
} from "./orbits";
import { AU_TO_SCENE_UNITS } from "./scale";

describe("orbit calculations", () => {
  const earthOrbit: OrbitConfig = {
    semiMajorAxisAU: 1,
    periodDays: 365.256,
    eccentricity: 0.0167
  };

  it("returns to nearly the same position after one period", () => {
    const start = orbitalPositionAU(earthOrbit, 0);
    const end = orbitalPositionAU(earthOrbit, earthOrbit.periodDays);
    expect(end.x).toBeCloseTo(start.x, 6);
    expect(end.z).toBeCloseTo(start.z, 6);
  });

  it("moves retrograde orbits in the opposite direction", () => {
    const prograde = orbitProgress(10, { periodDays: 100 });
    const retrograde = orbitProgress(10, { periodDays: 100, retrograde: true });
    expect(retrograde).toBeCloseTo(-prograde, 8);
  });

  it("respects eccentricity by changing orbital radius", () => {
    const perihelion = orbitalPositionAU(earthOrbit, 0);
    const aphelion = orbitalPositionAU(earthOrbit, earthOrbit.periodDays / 2);
    expect(Math.abs(aphelion.x)).toBeGreaterThan(Math.abs(perihelion.x));
  });

  it("does not exaggerate heliocentric inclination in scene space", () => {
    const shallowOrbit: OrbitConfig = {
      semiMajorAxisAU: 1,
      periodDays: 100,
      inclinationDeg: 2,
      phaseDeg: 90
    };
    const au = orbitalPositionAU(shallowOrbit, 0);
    const scene = orbitalPositionScene(shallowOrbit, 0);
    expect(scene.y).toBeCloseTo(au.y * AU_TO_SCENE_UNITS, 6);
  });
});
