import type {
  SurfaceTextureQuality,
  SurfaceTextureSet,
  SurfaceTextureVariant
} from "../types";

const qualityOrder: SurfaceTextureQuality[] = ["high", "medium", "low"];

export interface SurfaceQualityRequest {
  focused: boolean;
  viewportWidth: number;
  maxTextureSize: number;
}

export interface SurfaceQualitySelection {
  quality: SurfaceTextureQuality;
  variant: SurfaceTextureVariant;
  displacementEnabled: boolean;
  reason: "focused-high" | "desktop-medium" | "mobile-low" | "texture-limit";
}

export function selectSurfaceQuality(
  textureSet: SurfaceTextureSet,
  request: SurfaceQualityRequest
): SurfaceQualitySelection {
  const mobileLike = request.viewportWidth <= 720 || request.maxTextureSize < 4096;
  const preferredQuality: SurfaceTextureQuality = mobileLike
    ? "low"
    : request.focused
      ? "high"
      : "medium";

  const reason: SurfaceQualitySelection["reason"] = mobileLike
    ? "mobile-low"
    : request.focused
      ? "focused-high"
      : "desktop-medium";

  const selectedQuality = bestFittingQuality(textureSet, preferredQuality, request.maxTextureSize);
  const variant = textureSet.qualityVariants[selectedQuality];
  const displacementEnabled =
    Boolean(variant.displacement) &&
    textureSet.hasMeasuredHeight &&
    request.focused &&
    !mobileLike &&
    request.maxTextureSize >= Math.max(4096, variant.resolution[0]);

  return {
    quality: selectedQuality,
    variant,
    displacementEnabled,
    reason: selectedQuality === preferredQuality ? reason : "texture-limit"
  };
}

function bestFittingQuality(
  textureSet: SurfaceTextureSet,
  preferredQuality: SurfaceTextureQuality,
  maxTextureSize: number
) {
  const preferredIndex = qualityOrder.indexOf(preferredQuality);
  const candidates = qualityOrder.slice(preferredIndex);

  for (const quality of candidates) {
    const variant = textureSet.qualityVariants[quality];
    if (Math.max(...variant.resolution) <= maxTextureSize) {
      return quality;
    }
  }

  return "low";
}

export function surfaceGeometrySegments(
  textureSet: SurfaceTextureSet | undefined,
  selection: SurfaceQualitySelection | undefined,
  fallback: { width: number; height: number }
) {
  if (!textureSet || !selection) {
    return fallback;
  }

  if (selection.displacementEnabled) {
    return { width: 384, height: 192 };
  }

  if (selection.quality === "high") {
    return { width: 192, height: 96 };
  }

  if (selection.quality === "medium") {
    return { width: 128, height: 64 };
  }

  return fallback;
}
