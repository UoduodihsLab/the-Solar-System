import { describe, expect, it } from "vitest";
import { surfaceTextureSets } from "../data/surfaceAssets";
import {
  selectSurfaceQuality,
  surfaceGeometrySegments
} from "./surfaceQuality";

describe("surface quality selection", () => {
  it("uses high quality displacement for focused desktop measured bodies", () => {
    const selection = selectSurfaceQuality(surfaceTextureSets.earth, {
      focused: true,
      viewportWidth: 1440,
      maxTextureSize: 16384
    });

    expect(selection.quality).toBe("high");
    expect(selection.displacementEnabled).toBe(true);
    expect(selection.reason).toBe("focused-high");
  });

  it("falls back to medium when high textures exceed the GPU limit", () => {
    const selection = selectSurfaceQuality(surfaceTextureSets.earth, {
      focused: true,
      viewportWidth: 1440,
      maxTextureSize: 4096
    });

    expect(selection.quality).toBe("medium");
    expect(selection.displacementEnabled).toBe(true);
    expect(selection.reason).toBe("texture-limit");
  });

  it("uses low quality without displacement on mobile-sized viewports", () => {
    const selection = selectSurfaceQuality(surfaceTextureSets.earth, {
      focused: true,
      viewportWidth: 390,
      maxTextureSize: 8192
    });

    expect(selection.quality).toBe("low");
    expect(selection.displacementEnabled).toBe(false);
    expect(selection.reason).toBe("mobile-low");
  });

  it("never applies displacement to representative gas giant textures", () => {
    const selection = selectSurfaceQuality(surfaceTextureSets.jupiter, {
      focused: true,
      viewportWidth: 1440,
      maxTextureSize: 8192
    });

    expect(selection.quality).toBe("high");
    expect(selection.displacementEnabled).toBe(false);
  });

  it("increases geometry detail only when displacement is active", () => {
    const high = selectSurfaceQuality(surfaceTextureSets.mars, {
      focused: true,
      viewportWidth: 1440,
      maxTextureSize: 8192
    });
    const low = selectSurfaceQuality(surfaceTextureSets.mars, {
      focused: true,
      viewportWidth: 390,
      maxTextureSize: 8192
    });

    expect(surfaceGeometrySegments(surfaceTextureSets.mars, high, { width: 48, height: 24 })).toEqual({
      width: 384,
      height: 192
    });
    expect(surfaceGeometrySegments(surfaceTextureSets.mars, low, { width: 48, height: 24 })).toEqual({
      width: 48,
      height: 24
    });
  });
});
