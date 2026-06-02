import type { BodyKind } from "../types";

export const EARTH_RADIUS_KM = 6371;
export const SUN_RADIUS_KM = 695700;
export const AU_KM = 149_597_870.7;
export const AU_TO_SCENE_UNITS = 120;
export const LINEAR_AU_LIMIT = 35;
export const FAR_LAYER_LOG_SCALE = 1200;

export function distanceAUToSceneUnits(au: number) {
  if (au <= LINEAR_AU_LIMIT) {
    return au * AU_TO_SCENE_UNITS;
  }

  return (
    LINEAR_AU_LIMIT * AU_TO_SCENE_UNITS +
    Math.log10(au / LINEAR_AU_LIMIT) * FAR_LAYER_LOG_SCALE
  );
}

export function sceneUnitsToDistanceAU(units: number) {
  const linearLimitUnits = LINEAR_AU_LIMIT * AU_TO_SCENE_UNITS;
  if (units <= linearLimitUnits) {
    return units / AU_TO_SCENE_UNITS;
  }

  return (
    LINEAR_AU_LIMIT *
    10 ** ((units - linearLimitUnits) / FAR_LAYER_LOG_SCALE)
  );
}

export function radiusKmToSceneUnits(radiusKm: number, kind: BodyKind) {
  if (kind === "star") {
    return 26;
  }

  if (kind === "moon") {
    return Math.max(Math.pow(radiusKm / EARTH_RADIUS_KM, 0.58) * 0.78, 0.12);
  }

  if (kind === "dwarf") {
    return Math.max(Math.pow(radiusKm / EARTH_RADIUS_KM, 0.58) * 0.86, 0.18);
  }

  return Math.max(Math.pow(radiusKm / EARTH_RADIUS_KM, 0.55) * 1.08, 0.42);
}

export function moonOrbitKmToSceneUnits(
  semiMajorAxisKm: number,
  parentRadiusKm: number,
  parentVisualRadius: number
) {
  const radiusRatio = semiMajorAxisKm / parentRadiusKm;
  const logSpread = Math.log10(radiusRatio + 1) * parentVisualRadius * 2.9;
  const absoluteSpread = Math.sqrt(semiMajorAxisKm / 220_000) * 0.95;
  return parentVisualRadius + logSpread + absoluteSpread;
}

export function formatDistanceAU(au?: number) {
  if (au == null) {
    return "中心天体";
  }

  if (au >= 1000) {
    return `${Math.round(au).toLocaleString("zh-CN")} AU`;
  }

  return `${au.toFixed(2)} AU`;
}
