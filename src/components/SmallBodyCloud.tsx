import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Points,
  Vector3
} from "three";
import type {
  SmallBodyPopulationConfig,
  TargetRegistration
} from "../types";
import { mulberry32 } from "../lib/math";
import { distanceAUToSceneUnits } from "../lib/scale";

type RegisterTarget = (
  id: string,
  registration: TargetRegistration | null
) => void;

function randomBeltPoint(
  random: () => number,
  population: SmallBodyPopulationConfig
) {
  const radiusAU =
    population.minAU +
    (population.maxAU - population.minAU) *
      (population.distribution === "distant-belt" ? Math.pow(random(), 1.25) : random());
  const theta = random() * Math.PI * 2;
  const radius = distanceAUToSceneUnits(radiusAU);
  const verticalScale = population.distribution === "distant-belt" ? 18 : 120;
  return new Vector3(
    Math.cos(theta) * radius,
    (random() - 0.5) * population.verticalSpreadAU * verticalScale,
    Math.sin(theta) * radius
  );
}

function randomTrojanPoint(
  random: () => number,
  population: SmallBodyPopulationConfig
) {
  const swarmCenter = random() > 0.5 ? Math.PI / 3 : -Math.PI / 3;
  const theta = swarmCenter + (random() - 0.5) * 0.72;
  const radiusAU = population.minAU + (population.maxAU - population.minAU) * random();
  const radius = distanceAUToSceneUnits(radiusAU);
  return new Vector3(
    Math.cos(theta) * radius,
    (random() - 0.5) * population.verticalSpreadAU * 90,
    Math.sin(theta) * radius
  );
}

function randomCloudPoint(
  random: () => number,
  population: SmallBodyPopulationConfig
) {
  const u = random();
  const v = random();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const logMin = Math.log10(population.minAU);
  const logMax = Math.log10(population.maxAU);
  const radius = distanceAUToSceneUnits(10 ** (logMin + (logMax - logMin) * random()));
  return new Vector3(
    Math.sin(phi) * Math.cos(theta) * radius,
    Math.cos(phi) * radius,
    Math.sin(phi) * Math.sin(theta) * radius
  );
}

function randomCometPoint(
  random: () => number,
  population: SmallBodyPopulationConfig
) {
  const theta = random() * Math.PI * 2;
  const eccentricPull = Math.pow(random(), 2.4);
  const radiusAU =
    population.minAU + (population.maxAU - population.minAU) * eccentricPull;
  const radius = distanceAUToSceneUnits(radiusAU);
  const inclination = (random() - 0.5) * Math.PI * 0.7;
  return new Vector3(
    Math.cos(theta) * radius,
    Math.sin(theta) * Math.sin(inclination) * radius * 0.5,
    Math.sin(theta) * Math.cos(inclination) * radius
  );
}

export function SmallBodyCloud({
  population,
  labelsVisible,
  selectedId,
  onSelect,
  registerTarget
}: {
  population: SmallBodyPopulationConfig;
  labelsVisible: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  registerTarget: RegisterTarget;
}) {
  const groupRef = useRef<Group>(null);
  const pointsRef = useRef<Points>(null);
  const focusRadius = distanceAUToSceneUnits(population.focusAU);
  const labelPosition = useMemo<[number, number, number]>(
    () => [focusRadius, population.distribution === "spherical-cloud" ? focusRadius * 0.26 : 16, 0],
    [focusRadius, population.distribution]
  );
  const geometry = useMemo(() => {
    const random = mulberry32(population.seed);
    const positions = new Float32Array(population.count * 3);

    for (let index = 0; index < population.count; index += 1) {
      const point =
        population.distribution === "trojan"
          ? randomTrojanPoint(random, population)
          : population.distribution === "spherical-cloud"
            ? randomCloudPoint(random, population)
            : population.distribution === "comet"
              ? randomCometPoint(random, population)
              : randomBeltPoint(random, population);
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;
    }

    const nextGeometry = new BufferGeometry();
    nextGeometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return nextGeometry;
  }, [population]);

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }

    registerTarget(population.id, {
      object: groupRef.current,
      focusRadius: Math.max(focusRadius * 1.18, 120)
    });

    return () => registerTarget(population.id, null);
  }, [focusRadius, population.id, registerTarget]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const direction = population.distribution === "comet" ? -1 : 1;
      pointsRef.current.rotation.y = direction * clock.elapsedTime * 0.0025;
    }
  });

  return (
    <group ref={groupRef}>
      <points
        ref={pointsRef}
        geometry={geometry}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(population.id);
        }}
      >
        <pointsMaterial
          color={population.color}
          size={population.pointSize}
          transparent
          opacity={selectedId === population.id ? Math.min(population.opacity + 0.24, 1) : population.opacity}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {labelsVisible ? (
        <Html
          position={labelPosition}
          center
          distanceFactor={population.distribution === "spherical-cloud" ? 1200 : 240}
          className={`space-label population ${
            selectedId === population.id ? "is-selected" : ""
          }`}
        >
          {population.nameZh}
        </Html>
      ) : null}
    </group>
  );
}
