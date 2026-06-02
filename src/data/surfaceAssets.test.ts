import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { bodiesById } from "./solarSystem";
import {
  surfaceTextureSets,
  texturedBodyIds
} from "./surfaceAssets";
import type { SurfaceAccuracyKind, SurfaceTextureVariant } from "../types";

const accuracyKinds = new Set<SurfaceAccuracyKind>([
  "measured",
  "representative",
  "artistic",
  "procedural"
]);

describe("surface texture assets", () => {
  it("registers texture sets on the planned bodies", () => {
    for (const bodyId of texturedBodyIds) {
      const body = bodiesById[bodyId];
      expect(body).toBeDefined();
      expect(body.surface.textureSet).toBe(bodyId);
      expect(surfaceTextureSets[bodyId]).toBeDefined();
    }
  });

  it("keeps every registered asset path backed by a public file", () => {
    for (const textureSet of Object.values(surfaceTextureSets)) {
      expect(accuracyKinds.has(textureSet.accuracyKind)).toBe(true);
      expect(textureSet.sourceMetadata.title).toBeTruthy();
      expect(textureSet.sourceMetadata.url).toMatch(/^https:\/\//);
      expect(textureSet.sourceMetadata.credit).toBeTruthy();

      for (const [quality, variant] of Object.entries(textureSet.qualityVariants)) {
        expect(quality).toMatch(/^(low|medium|high)$/);
        expect(publicAssetExists(variant.albedo)).toBe(true);
        expectVariantAssetExists(variant);
      }
    }
  });

  it("only enables measured height maps above the low quality tier", () => {
    for (const textureSet of Object.values(surfaceTextureSets)) {
      const low = textureSet.qualityVariants.low;

      expect(low.displacement).toBeUndefined();

      if (textureSet.hasMeasuredHeight) {
        expect(textureSet.qualityVariants.medium.displacement).toBeTruthy();
        expect(textureSet.qualityVariants.high.displacement).toBeTruthy();
      } else {
        expect(textureSet.qualityVariants.medium.displacement).toBeUndefined();
        expect(textureSet.qualityVariants.high.displacement).toBeUndefined();
      }
    }
  });
});

function expectVariantAssetExists(variant: SurfaceTextureVariant) {
  for (const path of [
    variant.normal,
    variant.roughness,
    variant.displacement,
    variant.clouds,
    variant.night
  ]) {
    if (path) {
      expect(publicAssetExists(path)).toBe(true);
    }
  }
}

function publicAssetExists(assetPath: string) {
  return existsSync(join(process.cwd(), "public", assetPath.replace(/^\//, "")));
}
