import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, useCallback, useRef } from "react";
import {
  ACESFilmicToneMapping,
  Group,
  Object3D,
  SRGBColorSpace
} from "three";
import type { TargetRegistration } from "../types";
import { bodiesById, smallBodyPopulations } from "../data/solarSystem";
import { advanceSimulationDays } from "../lib/time";
import { CelestialBodyNode } from "./CelestialBodyNode";
import { CameraRig } from "./CameraRig";
import { SmallBodyCloud } from "./SmallBodyCloud";
import { SpaceEnvironment } from "./SpaceEnvironment";

export function SolarSystemScene({
  elapsedDays,
  setElapsedDays,
  playing,
  daysPerSecond,
  selectedId,
  labelsVisible,
  orbitsVisible,
  focusId,
  focusNonce,
  onSelect,
  targetRegistry
}: {
  elapsedDays: number;
  setElapsedDays: React.Dispatch<React.SetStateAction<number>>;
  playing: boolean;
  daysPerSecond: number;
  selectedId: string;
  labelsVisible: boolean;
  orbitsVisible: boolean;
  focusId: string;
  focusNonce: number;
  onSelect: (id: string) => void;
  targetRegistry: React.MutableRefObject<Map<string, TargetRegistration>>;
}) {
  const sunObjectRef = useRef<Object3D | null>(null);
  const registerTarget = useCallback(
    (id: string, registration: TargetRegistration | null) => {
      if (registration) {
        targetRegistry.current.set(id, registration);
      } else {
        targetRegistry.current.delete(id);
      }
    },
    [targetRegistry]
  );

  return (
    <Canvas
      className="space-canvas"
      camera={{ position: [0, 115, 260], fov: 52, near: 0.03, far: 18000 }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={["#020309"]} />
      <Suspense fallback={null}>
        <SimulationTicker
          playing={playing}
          daysPerSecond={daysPerSecond}
          setElapsedDays={setElapsedDays}
        />
        <CameraRig
          focusId={focusId}
          focusNonce={focusNonce}
          targetRegistry={targetRegistry}
        />
        <SpaceEnvironment elapsedDays={elapsedDays} />
        <ambientLight intensity={0.08} color="#9fb7d1" />
        <SolarSystemRoot elapsedDays={elapsedDays}>
          <pointLight position={[0, 0, 0]} intensity={1200} distance={5200} color="#ffd19a" />
          <CelestialBodyNode
            body={bodiesById.sun}
            elapsedDays={elapsedDays}
            selectedId={selectedId}
            labelsVisible={labelsVisible}
            orbitsVisible={orbitsVisible}
            onSelect={onSelect}
            registerTarget={registerTarget}
            sunObjectRef={sunObjectRef}
          />
          {smallBodyPopulations.map((population) => (
            <SmallBodyCloud
              key={population.id}
              population={population}
              labelsVisible={labelsVisible}
              selectedId={selectedId}
              onSelect={onSelect}
              registerTarget={registerTarget}
            />
          ))}
        </SolarSystemRoot>
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={1.25}
            luminanceThreshold={0.12}
            luminanceSmoothing={0.72}
            mipmapBlur
          />
          <Vignette offset={0.18} darkness={0.55} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

function SimulationTicker({
  playing,
  daysPerSecond,
  setElapsedDays
}: {
  playing: boolean;
  daysPerSecond: number;
  setElapsedDays: React.Dispatch<React.SetStateAction<number>>;
}) {
  useFrame((_, delta) => {
    setElapsedDays((current) =>
      advanceSimulationDays(current, delta, playing, daysPerSecond)
    );
  });

  return null;
}

function SolarSystemRoot({
  elapsedDays,
  children
}: {
  elapsedDays: number;
  children: React.ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const empty = useRef<Object3D>(new Object3D());

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }
    const visualGalacticAngle = elapsedDays * 0.000006;
    groupRef.current.position.set(
      Math.sin(visualGalacticAngle) * 26,
      Math.sin(visualGalacticAngle * 0.7) * 4,
      Math.cos(visualGalacticAngle) * 26 - 26
    );
    groupRef.current.rotation.y = elapsedDays * 0.0000009;
    empty.current.position.copy(groupRef.current.position);
  });

  return <group ref={groupRef}>{children}</group>;
}
