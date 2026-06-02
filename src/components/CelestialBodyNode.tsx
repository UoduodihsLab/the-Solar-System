import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, type RefObject } from "react";
import { Group, Mesh, Object3D, Vector3 } from "three";
import type { CelestialBodyConfig, TargetRegistration } from "../types";
import { bodiesById, childrenByParent } from "../data/solarSystem";
import { getSurfaceTextureSet } from "../data/surfaceAssets";
import { TAU, DEG_TO_RAD } from "../lib/math";
import {
  moonOrbitKmToSceneUnits,
  radiusKmToSceneUnits
} from "../lib/scale";
import {
  circularOrbitPositionScene,
  orbitalPositionScene
} from "../lib/orbits";
import {
  selectSurfaceQuality,
  surfaceGeometrySegments
} from "../lib/surfaceQuality";
import {
  AtmosphereShell,
  CoronaShell,
  RealisticBodyMaterial,
  SurfaceOverlayLayers
} from "./ProceduralMaterials";
import { OrbitLine } from "./OrbitLine";
import { RingSystem } from "./RingSystem";
import { IrregularSatelliteCloud } from "./IrregularSatelliteCloud";

type RegisterTarget = (
  id: string,
  registration: TargetRegistration | null
) => void;

function bodyFocusRadius(body: CelestialBodyConfig, visualRadius: number) {
  if (body.kind === "star") {
    return 120;
  }
  if (body.kind === "planet") {
    return Math.max(visualRadius * 16, 34);
  }
  if (body.kind === "dwarf") {
    return Math.max(visualRadius * 18, 18);
  }
  return Math.max(visualRadius * 22, 7);
}

function bodyOrbitRadius(body: CelestialBodyConfig) {
  if (!body.orbit?.semiMajorAxisKm || !body.parentId) {
    return undefined;
  }

  const parent = bodiesById[body.parentId];
  if (!parent) {
    return undefined;
  }

  return moonOrbitKmToSceneUnits(
    body.orbit.semiMajorAxisKm,
    parent.radiusKm,
    radiusKmToSceneUnits(parent.radiusKm, parent.kind)
  );
}

function atmosphereOpacity(body: CelestialBodyConfig) {
  if (body.id === "venus" || body.id === "titan") {
    return 0.32;
  }

  if (body.id === "earth") {
    return 0.2;
  }

  if (body.id === "uranus" || body.id === "neptune") {
    return 0.18;
  }

  return 0.14;
}

export const CelestialBodyNode = memo(function CelestialBodyNode({
  body,
  elapsedDays,
  selectedId,
  labelsVisible,
  orbitsVisible,
  onSelect,
  registerTarget,
  sunObjectRef
}: {
  body: CelestialBodyConfig;
  elapsedDays: number;
  selectedId: string;
  labelsVisible: boolean;
  orbitsVisible: boolean;
  onSelect: (id: string) => void;
  registerTarget: RegisterTarget;
  sunObjectRef: RefObject<Object3D | null>;
}) {
  const groupRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const { gl, size } = useThree();
  const visualRadius = radiusKmToSceneUnits(body.radiusKm, body.kind);
  const moonOrbitRadius = bodyOrbitRadius(body);
  const children = childrenByParent[body.id] ?? [];
  const isSelected = selectedId === body.id;
  const textureSet = getSurfaceTextureSet(body.surface.textureSet);
  const maxTextureSize = gl.capabilities.maxTextureSize;
  const qualitySelection = useMemo(
    () =>
      textureSet
        ? selectSurfaceQuality(textureSet, {
            focused: isSelected,
            viewportWidth: size.width,
            maxTextureSize
          })
        : undefined,
    [isSelected, maxTextureSize, size.width, textureSet]
  );
  const defaultSegments = {
    width: body.kind === "star" || body.kind === "planet" ? 96 : 48,
    height: body.kind === "star" || body.kind === "planet" ? 48 : 24
  };
  const segments = useMemo(
    () => surfaceGeometrySegments(textureSet, qualitySelection, defaultSegments),
    [defaultSegments, qualitySelection, textureSet]
  );
  const showLabel =
    labelsVisible &&
    (body.kind === "star" || body.kind === "planet" || body.kind === "dwarf" || isSelected);
  const lumpyScale = useMemo<[number, number, number]>(() => {
    if (body.kind === "moon" && body.radiusKm < 320) {
      return [1.22, 0.82, 0.96];
    }
    return [1, 1, 1];
  }, [body.kind, body.radiusKm]);

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }

    registerTarget(body.id, {
      object: groupRef.current,
      focusRadius: bodyFocusRadius(body, visualRadius)
    });

    return () => registerTarget(body.id, null);
  }, [body, registerTarget, visualRadius]);

  useEffect(() => {
    if (body.id !== "sun" || !groupRef.current) {
      return;
    }

    sunObjectRef.current = groupRef.current;

    return () => {
      if (sunObjectRef.current === groupRef.current) {
        sunObjectRef.current = null;
      }
    };
  }, [body.id, sunObjectRef]);

  useFrame(() => {
    if (groupRef.current && body.orbit) {
      const position =
        body.orbit.semiMajorAxisAU != null
          ? orbitalPositionScene(body.orbit, elapsedDays)
          : circularOrbitPositionScene(moonOrbitRadius ?? 0, body.orbit, elapsedDays);
      groupRef.current.position.set(position.x, position.y, position.z);
    }

    if (spinRef.current && body.rotation) {
      const direction = body.rotation.retrograde ? -1 : 1;
      spinRef.current.rotation.y =
        direction * (elapsedDays * 24 * TAU) / body.rotation.periodHours;
    }
  });

  return (
    <>
      {orbitsVisible && body.orbit ? (
        <OrbitLine
          orbit={body.orbit}
          radiusOverrideSceneUnits={moonOrbitRadius}
          color={body.kind === "moon" ? "#6f86a8" : "#49647f"}
          opacity={body.kind === "moon" ? 0.22 : 0.32}
        />
      ) : null}

      <group ref={groupRef}>
        <group rotation={[0, 0, (body.rotation?.axialTiltDeg ?? 0) * DEG_TO_RAD]}>
          <group ref={spinRef}>
            <mesh
              ref={meshRef}
              scale={lumpyScale}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(body.id);
              }}
            >
              <sphereGeometry
                args={[
                  visualRadius,
                  segments.width,
                  segments.height
                ]}
              />
              <RealisticBodyMaterial
                body={body}
                textureSet={textureSet}
                qualitySelection={qualitySelection}
                visualRadius={visualRadius}
                targetObjectRef={meshRef}
                sunObjectRef={sunObjectRef}
              />
            </mesh>
            <SurfaceOverlayLayers
              body={body}
              textureSet={textureSet}
              qualitySelection={qualitySelection}
              radius={visualRadius}
              sunObjectRef={sunObjectRef}
            />
          </group>
        </group>

        {body.surface.atmosphereColor && body.kind !== "star" ? (
          <AtmosphereShell
            color={body.surface.atmosphereColor}
            radius={visualRadius}
            opacity={atmosphereOpacity(body)}
            sunObjectRef={sunObjectRef}
          />
        ) : null}
        {body.kind === "star" ? (
          <>
            <CoronaShell radius={visualRadius} />
            <SolarProminences radius={visualRadius} />
          </>
        ) : null}
        {body.rings ? <RingSystem body={body} bodyRadius={visualRadius} /> : null}
        {body.irregularSatellites ? (
          <IrregularSatelliteCloud body={body} bodyRadius={visualRadius} />
        ) : null}

        {showLabel ? (
          <Html
            position={[0, visualRadius + (body.kind === "star" ? 12 : 2.4), 0]}
            center
            distanceFactor={body.kind === "star" ? 280 : 120}
            className={`space-label ${isSelected ? "is-selected" : ""}`}
          >
            {body.nameZh}
          </Html>
        ) : null}

        {isSelected ? (
          <SelectedHalo radius={visualRadius} body={body} />
        ) : null}

        {children.map((child) => (
          <CelestialBodyNode
            key={child.id}
            body={child}
            elapsedDays={elapsedDays}
            selectedId={selectedId}
            labelsVisible={labelsVisible}
            orbitsVisible={orbitsVisible}
            onSelect={onSelect}
            registerTarget={registerTarget}
            sunObjectRef={sunObjectRef}
          />
        ))}
      </group>
    </>
  );
});

function SelectedHalo({
  radius,
  body
}: {
  radius: number;
  body: CelestialBodyConfig;
}) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.18, 48, 24]} />
      <meshBasicMaterial
        color={body.kind === "star" ? "#ffcf70" : "#9ee7ff"}
        transparent
        opacity={0.18}
        depthWrite={false}
        wireframe
      />
    </mesh>
  );
}

function SolarProminences({ radius }: { radius: number }) {
  const groupRef = useRef<Group>(null);
  const arcs = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        rotation: [
          (index * 31 + 15) * DEG_TO_RAD,
          (index * 47 + 22) * DEG_TO_RAD,
          (index * 71) * DEG_TO_RAD
        ] as [number, number, number],
        scale: 0.38 + (index % 3) * 0.12
      })),
    []
  );

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {arcs.map((arc, index) => (
        <mesh
          key={index}
          rotation={arc.rotation}
          position={new Vector3(radius * 0.05, 0, 0)}
          scale={[1, arc.scale, 1]}
        >
          <torusGeometry args={[radius * 1.02, 0.035 * radius, 8, 80, Math.PI * 1.05]} />
          <meshBasicMaterial
            color="#ff4b1f"
            transparent
            opacity={0.42}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
