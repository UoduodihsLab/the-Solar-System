import { describe, expect, it } from "vitest";
import {
  AU_TO_SCENE_UNITS,
  distanceAUToSceneUnits,
  radiusKmToSceneUnits,
  sceneUnitsToDistanceAU
} from "./scale";

describe("scale mapping", () => {
  it("keeps the inner solar system in linear AU scale", () => {
    expect(distanceAUToSceneUnits(1)).toBe(AU_TO_SCENE_UNITS);
    expect(distanceAUToSceneUnits(30)).toBe(30 * AU_TO_SCENE_UNITS);
  });

  it("compresses remote structures without losing ordering", () => {
    const neptune = distanceAUToSceneUnits(30);
    const kuiper = distanceAUToSceneUnits(50);
    const oort = distanceAUToSceneUnits(100_000);
    expect(kuiper).toBeGreaterThan(neptune);
    expect(oort).toBeGreaterThan(kuiper);
    expect(oort).toBeLessThan(10_000);
  });

  it("can invert the distance mapping approximately", () => {
    const sourceAU = 20_000;
    expect(sceneUnitsToDistanceAU(distanceAUToSceneUnits(sourceAU))).toBeCloseTo(
      sourceAU,
      4
    );
  });

  it("makes all body classes visible", () => {
    expect(radiusKmToSceneUnits(1737, "moon")).toBeGreaterThan(0.1);
    expect(radiusKmToSceneUnits(2440, "planet")).toBeGreaterThan(0.4);
    expect(radiusKmToSceneUnits(695700, "star")).toBe(26);
  });
});
