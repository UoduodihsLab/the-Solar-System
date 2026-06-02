import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Points,
  Vector3
} from "three";
import { mulberry32 } from "../lib/math";

function pointGeometry(count: number, seed: number, radius: number, disk = false) {
  const random = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    if (disk) {
      const theta = random() * Math.PI * 2;
      const r = radius * (0.55 + random() * 0.45);
      positions[index * 3] = Math.cos(theta) * r;
      positions[index * 3 + 1] = (random() - 0.5) * radius * 0.035;
      positions[index * 3 + 2] = Math.sin(theta) * r * (0.35 + random() * 0.2);
    } else {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const r = radius * (0.75 + random() * 0.25);
      positions[index * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[index * 3 + 1] = Math.cos(phi) * r;
      positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  return geometry;
}

export function SpaceEnvironment({ elapsedDays }: { elapsedDays: number }) {
  const galaxyRef = useRef<Group>(null);
  const starsRef = useRef<Points>(null);
  const stars = useMemo(() => pointGeometry(10000, 9001, 9800), []);
  const galaxy = useMemo(() => pointGeometry(8500, 9002, 7600, true), []);
  const arc = useMemo<[number, number, number][]>(() => {
    const points: Vector3[] = [];
    for (let index = 0; index <= 160; index += 1) {
      const t = (-0.34 + (index / 160) * 0.68) * Math.PI;
      points.push(new Vector3(Math.cos(t) * 6400 - 5400, -820, Math.sin(t) * 6400));
    }
    return points.map((point) => [point.x, point.y, point.z]);
  }, []);

  useFrame(({ clock }) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = elapsedDays * 0.00000008;
    }
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.elapsedTime * 0.0008;
    }
  });

  return (
    <>
      <points ref={starsRef} geometry={stars}>
        <pointsMaterial
          color="#dce8ff"
          size={0.75}
          transparent
          opacity={0.82}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <group ref={galaxyRef} rotation={[0.12, -0.45, -0.06]}>
        <points geometry={galaxy}>
          <pointsMaterial
            color="#b8d7ff"
            size={1.6}
            transparent
            opacity={0.18}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
        <Line
          points={arc}
          color="#b9b05f"
          transparent
          opacity={0.32}
          lineWidth={1}
          depthWrite={false}
        />
        <Html
          position={[-9300, -700, -1200]}
          center
          distanceFactor={2600}
          className="space-label galaxy"
        >
          银河中心方向
        </Html>
      </group>
    </>
  );
}
