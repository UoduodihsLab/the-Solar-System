import { useMemo, useRef } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial
} from "three";
import { useFrame } from "@react-three/fiber";
import type { CelestialBodyConfig } from "../types";
import { DEG_TO_RAD, mulberry32 } from "../lib/math";
import { moonOrbitKmToSceneUnits } from "../lib/scale";

export function IrregularSatelliteCloud({
  body,
  bodyRadius
}: {
  body: CelestialBodyConfig;
  bodyRadius: number;
}) {
  const pointsRef = useRef<Points>(null);
  const population = body.irregularSatellites;
  const geometry = useMemo(() => {
    if (!population) {
      return null;
    }

    const random = mulberry32(population.seed);
    const positions = new Float32Array(population.count * 3);
    const min = moonOrbitKmToSceneUnits(
      population.minOrbitKm,
      body.radiusKm,
      bodyRadius
    );
    const max = moonOrbitKmToSceneUnits(
      population.maxOrbitKm,
      body.radiusKm,
      bodyRadius
    );

    for (let index = 0; index < population.count; index += 1) {
      const radius = min + (max - min) * Math.pow(random(), 0.72);
      const theta = random() * Math.PI * 2;
      const inclination =
        (population.inclinationDeg + (random() - 0.5) * 34) * DEG_TO_RAD;
      const wobble = (random() - 0.5) * radius * 0.12;
      positions[index * 3] = Math.cos(theta) * radius;
      positions[index * 3 + 1] = Math.sin(theta) * Math.sin(inclination) * radius + wobble;
      positions[index * 3 + 2] = Math.sin(theta) * Math.cos(inclination) * radius;
    }

    const nextGeometry = new BufferGeometry();
    nextGeometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return nextGeometry;
  }, [body.radiusKm, bodyRadius, population]);

  useFrame(({ clock }) => {
    if (pointsRef.current && population) {
      pointsRef.current.rotation.y =
        clock.elapsedTime * 0.015 * (population.retrogradeRatio > 0.5 ? -1 : 1);
    }
  });

  if (!population || !geometry) {
    return null;
  }

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={population.color}
        size={0.08}
        transparent
        opacity={0.72}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
