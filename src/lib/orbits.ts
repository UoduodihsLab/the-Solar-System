import type { OrbitConfig } from "../types";
import { DEG_TO_RAD, TAU, rotateX, rotateY, type Vec3 } from "./math";
import { distanceAUToSceneUnits } from "./scale";

export function solveKepler(meanAnomaly: number, eccentricity = 0) {
  let eccentricAnomaly = meanAnomaly;
  for (let i = 0; i < 6; i += 1) {
    eccentricAnomaly =
      eccentricAnomaly -
      (eccentricAnomaly -
        eccentricity * Math.sin(eccentricAnomaly) -
        meanAnomaly) /
        (1 - eccentricity * Math.cos(eccentricAnomaly));
  }
  return eccentricAnomaly;
}

export function orbitProgress(elapsedDays: number, orbit: OrbitConfig) {
  const direction = orbit.retrograde ? -1 : 1;
  const phase = (orbit.phaseDeg ?? 0) * DEG_TO_RAD;
  return direction * (elapsedDays / orbit.periodDays) * TAU + phase;
}

export function orbitalPositionAU(
  orbit: OrbitConfig,
  elapsedDays: number
): Vec3 {
  const semiMajorAxisAU = orbit.semiMajorAxisAU ?? 0;
  const eccentricity = orbit.eccentricity ?? 0;
  const meanAnomaly = orbitProgress(elapsedDays, orbit);
  const eccentricAnomaly = solveKepler(meanAnomaly, eccentricity);
  const trueAnomaly =
    2 *
    Math.atan2(
      Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
      Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
    );
  const radius =
    semiMajorAxisAU * (1 - eccentricity * Math.cos(eccentricAnomaly));
  const argument = trueAnomaly + (orbit.argumentOfPeriapsisDeg ?? 0) * DEG_TO_RAD;

  let point: Vec3 = {
    x: Math.cos(argument) * radius,
    y: 0,
    z: Math.sin(argument) * radius
  };

  point = rotateX(point, (orbit.inclinationDeg ?? 0) * DEG_TO_RAD);
  point = rotateY(point, (orbit.longitudeOfAscendingNodeDeg ?? 0) * DEG_TO_RAD);

  return point;
}

export function orbitalPositionScene(
  orbit: OrbitConfig,
  elapsedDays: number
): Vec3 {
  const au = orbitalPositionAU(orbit, elapsedDays);
  return {
    x: distanceAUToSceneUnits(au.x),
    y: distanceAUToSceneUnits(Math.abs(au.y)) * Math.sign(au.y),
    z: distanceAUToSceneUnits(au.z)
  };
}

export function circularOrbitPositionScene(
  radiusSceneUnits: number,
  orbit: OrbitConfig,
  elapsedDays: number
): Vec3 {
  const angle = orbitProgress(elapsedDays, orbit);
  const direction = orbit.retrograde ? -1 : 1;
  let point: Vec3 = {
    x: Math.cos(angle) * radiusSceneUnits,
    y: 0,
    z: Math.sin(angle) * radiusSceneUnits * direction
  };
  point = rotateX(point, (orbit.inclinationDeg ?? 0) * DEG_TO_RAD);
  return point;
}

export function buildOrbitSamples(
  orbit: OrbitConfig,
  sampleCount: number,
  radiusOverrideSceneUnits?: number
) {
  return Array.from({ length: sampleCount + 1 }, (_, index) => {
    const progress = index / sampleCount;
    const sampleOrbit = {
      ...orbit,
      phaseDeg: progress * 360,
      periodDays: 1
    };
    if (radiusOverrideSceneUnits != null) {
      return circularOrbitPositionScene(radiusOverrideSceneUnits, sampleOrbit, 0);
    }
    return orbitalPositionScene(sampleOrbit, 0);
  });
}
