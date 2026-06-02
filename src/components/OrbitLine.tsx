import { useMemo } from "react";
import { Line } from "@react-three/drei";
import type { OrbitConfig } from "../types";
import { buildOrbitSamples } from "../lib/orbits";

export function OrbitLine({
  orbit,
  color,
  radiusOverrideSceneUnits,
  opacity = 0.28
}: {
  orbit: OrbitConfig;
  color: string;
  radiusOverrideSceneUnits?: number;
  opacity?: number;
}) {
  const points = useMemo<[number, number, number][]>(() => {
    const points = buildOrbitSamples(orbit, 256, radiusOverrideSceneUnits);
    return points.map((point) => [point.x, point.y, point.z]);
  }, [orbit, radiusOverrideSceneUnits]);

  return (
    <Line
      points={points}
      color={color}
      transparent
      opacity={opacity}
      lineWidth={1}
      depthWrite={false}
    />
  );
}
