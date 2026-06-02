import { useMemo, useRef } from "react";
import { AdditiveBlending, Color, DoubleSide, type ShaderMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import type { CelestialBodyConfig } from "../types";
import { DEG_TO_RAD } from "../lib/math";

const ringVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragmentShader = `
  precision highp float;

  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;
  uniform float uOpacity;
  uniform float uBandCount;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float radial = length(vUv - vec2(0.5)) * 2.0;
    float bands = 0.5 + 0.5 * sin(radial * uBandCount * 28.0 + sin(radial * 17.0) * 0.8);
    float gaps = smoothstep(0.12, 0.9, bands);
    float feather = smoothstep(0.02, 0.14, radial) * (1.0 - smoothstep(0.92, 1.0, radial));
    vec3 color = mix(uSecondaryColor, uColor, gaps);
    gl_FragColor = vec4(color, uOpacity * feather * (0.38 + gaps * 0.62));
  }
`;

export function RingSystem({
  body,
  bodyRadius
}: {
  body: CelestialBodyConfig;
  bodyRadius: number;
}) {
  const materialRef = useRef<ShaderMaterial>(null);
  const ring = body.rings;
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(ring?.color ?? "#ffffff") },
      uSecondaryColor: { value: new Color(ring?.secondaryColor ?? ring?.color ?? "#888888") },
      uOpacity: { value: ring?.opacity ?? 0.3 },
      uBandCount: { value: ring?.bandCount ?? 4 },
      uTime: { value: 0 }
    }),
    [ring]
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  if (!ring) {
    return null;
  }

  const inner = bodyRadius * (ring.innerRadiusKm / body.radiusKm);
  const outer = bodyRadius * (ring.outerRadiusKm / body.radiusKm);
  const tilt = (body.rotation?.axialTiltDeg ?? 0) * DEG_TO_RAD;

  return (
    <group rotation={[0, 0, tilt]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[inner, outer, 256, 10]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={ringVertexShader}
          fragmentShader={ringFragmentShader}
          transparent
          depthWrite={false}
          side={DoubleSide}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
