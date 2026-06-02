import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, Color, type ShaderMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import type { CelestialBodyConfig, SurfaceStyle } from "../types";

const styleIds: Record<SurfaceStyle, number> = {
  sun: 0,
  mercury: 1,
  venus: 2,
  earth: 3,
  moon: 4,
  mars: 5,
  jupiter: 6,
  saturn: 7,
  uranus: 8,
  neptune: 9,
  ice: 10,
  rock: 11,
  dwarf: 12
};

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFragmentShader = `
  precision highp float;

  uniform vec3 uBaseColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uAtmosphereColor;
  uniform float uStyle;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  float stripe(float y, float scale, float sharpness) {
    return smoothstep(0.5 - sharpness, 0.5 + sharpness, 0.5 + 0.5 * sin(y * scale));
  }

  void main() {
    vec3 normal = normalize(vNormal);
    float light = clamp(dot(normal, normalize(vec3(0.35, 0.42, 0.82))) * 0.62 + 0.46, 0.12, 1.2);
    float rim = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 2.1);
    float n = fbm(normal * 4.0 + vec3(uTime * 0.03, 0.0, -uTime * 0.02));
    float fine = fbm(normal * 20.0 + vec3(0.0, uTime * 0.02, 0.0));
    vec3 color = mix(uBaseColor, uSecondaryColor, n);

    if (uStyle < 1.5) {
      float crater = smoothstep(0.63, 0.92, fine) * smoothstep(0.52, 0.05, n);
      color = mix(color * 0.74, uSecondaryColor, crater * 0.45);
    } else if (uStyle < 2.5) {
      float clouds = fbm(vec3(vUv * vec2(6.0, 3.0), uTime * 0.02));
      color = mix(uBaseColor * 0.72, uSecondaryColor, smoothstep(0.22, 0.9, clouds));
      color += uAtmosphereColor * 0.08;
    } else if (uStyle < 3.5) {
      float continents = smoothstep(0.44, 0.58, fbm(normal * 3.6 + vec3(0.0, 0.0, 0.2)));
      float clouds = smoothstep(0.62, 0.86, fbm(normal * 12.0 + vec3(uTime * 0.05, 0.0, 0.0)));
      color = mix(uBaseColor, uSecondaryColor, continents);
      color = mix(color, vec3(1.0), clouds * 0.32);
      color += uAtmosphereColor * rim * 0.18;
    } else if (uStyle < 4.5) {
      float crater = smoothstep(0.58, 0.95, fine);
      color = mix(uBaseColor * 0.78, uSecondaryColor, n * 0.55 + crater * 0.2);
    } else if (uStyle < 5.5) {
      float dust = fbm(normal * 8.0 + vec3(0.4, 0.0, 0.0));
      float caps = smoothstep(0.74, 0.92, abs(normal.y));
      color = mix(uBaseColor, uSecondaryColor, dust);
      color = mix(color, vec3(0.95, 0.9, 0.82), caps * 0.68);
    } else if (uStyle < 7.5) {
      float bands = stripe(vUv.y + n * 0.025, uStyle < 6.5 ? 78.0 : 58.0, 0.16);
      color = mix(uBaseColor * 0.82, uSecondaryColor, bands);
      float spot = 1.0 - smoothstep(0.0, 0.055, pow((vUv.x - 0.68) * 1.7, 2.0) + pow((vUv.y - 0.43) * 3.0, 2.0));
      if (uStyle < 6.5) {
        color = mix(color, vec3(0.72, 0.2, 0.12), spot * 0.72);
      }
    } else if (uStyle < 9.5) {
      float softBands = stripe(vUv.y + n * 0.018, uStyle < 8.5 ? 24.0 : 34.0, 0.28);
      float storm = smoothstep(0.78, 0.94, fine) * smoothstep(0.25, 0.7, abs(vUv.y - 0.45));
      color = mix(uBaseColor, uSecondaryColor, softBands * 0.34 + storm * 0.24);
      color += uAtmosphereColor * rim * 0.22;
    } else if (uStyle < 10.5) {
      float cracks = smoothstep(0.66, 0.78, abs(sin((vUv.x + n * 0.05) * 80.0)));
      color = mix(uBaseColor, uSecondaryColor, n * 0.45);
      color = mix(color, vec3(0.55, 0.42, 0.34), cracks * 0.14);
    } else {
      float rugged = fbm(normal * 10.0);
      color = mix(uBaseColor * 0.72, uSecondaryColor, rugged);
    }

    gl_FragColor = vec4(color * light + rim * uAtmosphereColor * 0.18, 1.0);
  }
`;

const sunFragmentShader = `
  precision highp float;

  uniform vec3 uBaseColor;
  uniform vec3 uSecondaryColor;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormal;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    float equatorFlow = uTime * (0.32 + 0.18 * (1.0 - abs(normal.y)));
    float cells = fbm(normal * 8.0 + vec3(equatorFlow, -uTime * 0.12, 0.0));
    float granules = fbm(normal * 36.0 + vec3(0.0, uTime * 0.28, equatorFlow));
    float flare = smoothstep(0.74, 1.0, granules) * 0.55;
    float sunspot = smoothstep(0.23, 0.08, cells) * smoothstep(0.2, 0.85, abs(normal.y));
    vec3 color = mix(uBaseColor, uSecondaryColor, cells * 0.75 + granules * 0.25);
    color = mix(color, vec3(0.35, 0.05, 0.0), sunspot * 0.55);
    color += vec3(1.0, 0.36, 0.05) * flare;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const coronaFragmentShader = `
  precision highp float;

  uniform vec3 uColor;
  uniform float uTime;
  varying vec3 vNormal;

  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.4);
    float pulse = 0.75 + 0.25 * sin(uTime * 2.1 + vNormal.y * 8.0);
    gl_FragColor = vec4(uColor * pulse, rim * 0.34);
  }
`;

export function ProceduralBodyMaterial({
  body
}: {
  body: CelestialBodyConfig;
}) {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uBaseColor: { value: new Color(body.surface.baseColor) },
      uSecondaryColor: { value: new Color(body.surface.secondaryColor) },
      uAtmosphereColor: {
        value: new Color(body.surface.atmosphereColor ?? body.surface.secondaryColor)
      },
      uStyle: { value: styleIds[body.surface.style] },
      uTime: { value: 0 }
    }),
    [body]
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={body.kind === "star" ? sunFragmentShader : planetFragmentShader}
      toneMapped={body.kind !== "star"}
    />
  );
}

export function AtmosphereShell({
  color,
  radius,
  opacity = 0.16
}: {
  color: string;
  radius: number;
  opacity?: number;
}) {
  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[radius, 48, 24]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function CoronaShell({ radius }: { radius: number }) {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color("#ff8b2c") },
      uTime: { value: 0 }
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh scale={1.42}>
      <sphereGeometry args={[radius, 96, 48]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={coronaFragmentShader}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
        side={BackSide}
        toneMapped={false}
      />
    </mesh>
  );
}
