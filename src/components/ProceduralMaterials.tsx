import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useTexture } from "@react-three/drei";
import {
  AdditiveBlending,
  BackSide,
  Color,
  DoubleSide,
  Mesh,
  SRGBColorSpace,
  Vector3,
  type Object3D,
  type ShaderMaterial,
  type Texture
} from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type {
  CelestialBodyConfig,
  SurfaceStyle,
  SurfaceTextureSet
} from "../types";
import type { SurfaceQualitySelection } from "../lib/surfaceQuality";

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

type SceneObjectRef = RefObject<Object3D | null>;

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
  uniform vec3 uLightDirection;
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
    float light = clamp(dot(normal, normalize(uLightDirection)) * 0.62 + 0.46, 0.12, 1.2);
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

const texturedSunFragmentShader = `
  precision highp float;

  uniform sampler2D uTexture;
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
    vec3 baseTexture = texture2D(uTexture, vUv).rgb;
    float equatorFlow = uTime * (0.32 + 0.18 * (1.0 - abs(normal.y)));
    float cells = fbm(normal * 8.0 + vec3(equatorFlow, -uTime * 0.12, 0.0));
    float granules = fbm(normal * 38.0 + vec3(0.0, uTime * 0.28, equatorFlow));
    float flare = smoothstep(0.74, 1.0, granules) * 0.5;
    float sunspot = smoothstep(0.23, 0.08, cells) * smoothstep(0.2, 0.85, abs(normal.y));
    vec3 procedural = mix(uBaseColor, uSecondaryColor, cells * 0.72 + granules * 0.28);
    vec3 color = mix(baseTexture * 1.25, procedural, 0.42);
    color = mix(color, vec3(0.28, 0.035, 0.0), sunspot * 0.55);
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

const nightLightsFragmentShader = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec3 uLightDirection;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec3 normal = normalize(vNormal);
    float night = smoothstep(0.24, -0.12, dot(normal, normalize(uLightDirection)));
    vec3 color = texture2D(uTexture, vUv).rgb;
    float alpha = max(max(color.r, color.g), color.b) * night * uOpacity;
    gl_FragColor = vec4(color * 1.7, alpha);
  }
`;

const atmosphereFragmentShader = `
  precision highp float;

  uniform vec3 uColor;
  uniform vec3 uLightDirection;
  uniform float uOpacity;
  varying vec3 vNormal;

  void main() {
    vec3 normal = normalize(vNormal);
    float sunFacing = dot(normal, normalize(uLightDirection));
    float rim = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
    float haze = smoothstep(0.04, 0.82, rim);
    float dayGlow = smoothstep(-0.12, 0.72, sunFacing);
    float terminatorGlow = smoothstep(0.44, 0.02, abs(sunFacing)) * haze;
    float alpha = uOpacity * haze * (0.72 + dayGlow * 0.22 + terminatorGlow * 0.34);
    vec3 color = uColor * (0.62 + haze * 0.74 + dayGlow * 0.24 + terminatorGlow * 0.38);
    gl_FragColor = vec4(color, alpha);
  }
`;

function configureColorTexture(texture?: Texture) {
  if (!texture) {
    return;
  }

  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = Math.max(texture.anisotropy, 8);
}

function configureDataTexture(texture?: Texture) {
  if (!texture) {
    return;
  }

  texture.anisotropy = Math.max(texture.anisotropy, 8);
}

function useSunLightDirectionUniform(
  materialRef: RefObject<ShaderMaterial | null>,
  targetObjectRef?: SceneObjectRef,
  sunObjectRef?: SceneObjectRef
) {
  const { camera } = useThree();
  const targetWorld = useMemo(() => new Vector3(), []);
  const sunWorld = useMemo(() => new Vector3(), []);
  const lightDirection = useMemo(() => new Vector3(0.35, 0.42, 0.82), []);

  useFrame(() => {
    const material = materialRef.current;
    const targetObject = targetObjectRef?.current;
    const sunObject = sunObjectRef?.current;
    const uniform = material?.uniforms.uLightDirection;

    if (!material || !uniform || !targetObject || !sunObject) {
      return;
    }

    targetObject.getWorldPosition(targetWorld);
    sunObject.getWorldPosition(sunWorld);
    lightDirection.subVectors(sunWorld, targetWorld);

    if (lightDirection.lengthSq() < 0.000001) {
      lightDirection.set(0.35, 0.42, 0.82);
    } else {
      lightDirection.normalize();
    }

    lightDirection.transformDirection(camera.matrixWorldInverse);
    uniform.value.copy(lightDirection);
  });
}

export function RealisticBodyMaterial({
  body,
  textureSet,
  qualitySelection,
  visualRadius,
  targetObjectRef,
  sunObjectRef
}: {
  body: CelestialBodyConfig;
  textureSet?: SurfaceTextureSet;
  qualitySelection?: SurfaceQualitySelection;
  visualRadius: number;
  targetObjectRef?: SceneObjectRef;
  sunObjectRef?: SceneObjectRef;
}) {
  if (!textureSet || !qualitySelection) {
    return (
      <ProceduralBodyMaterial
        body={body}
        targetObjectRef={targetObjectRef}
        sunObjectRef={sunObjectRef}
      />
    );
  }

  if (body.kind === "star") {
    return (
      <TexturedSunMaterial
        body={body}
        variant={qualitySelection.variant}
      />
    );
  }

  return (
    <TexturedSurfaceMaterial
      body={body}
      textureSet={textureSet}
      qualitySelection={qualitySelection}
      visualRadius={visualRadius}
    />
  );
}

function TexturedSurfaceMaterial({
  body,
  textureSet,
  qualitySelection,
  visualRadius
}: {
  body: CelestialBodyConfig;
  textureSet: SurfaceTextureSet;
  qualitySelection: SurfaceQualitySelection;
  visualRadius: number;
}) {
  const texturePaths = useMemo(() => {
    const variant = qualitySelection.variant;
    const paths: Record<string, string> = {
      map: variant.albedo
    };

    if (variant.normal) {
      paths.normalMap = variant.normal;
    }
    if (variant.roughness) {
      paths.roughnessMap = variant.roughness;
    }
    if (variant.displacement) {
      paths.displacementMap = variant.displacement;
    }

    return paths;
  }, [qualitySelection.variant]);

  const textures = useTexture(texturePaths) as Record<string, Texture>;
  const displacementScale = qualitySelection.displacementEnabled
    ? visualRadius * (textureSet.heightScale ?? 0.04)
    : 0;

  useEffect(() => {
    configureColorTexture(textures.map);
    configureDataTexture(textures.normalMap);
    configureDataTexture(textures.roughnessMap);
    configureDataTexture(textures.displacementMap);
  }, [textures]);

  const usesMeasuredRelief = Boolean(textures.displacementMap && textureSet.hasMeasuredHeight);
  const bumpScale = usesMeasuredRelief && !qualitySelection.displacementEnabled
    ? visualRadius * 0.018
    : 0;

  return (
    <meshStandardMaterial
      map={textures.map}
      normalMap={textures.normalMap}
      roughnessMap={textures.roughnessMap}
      displacementMap={
        qualitySelection.displacementEnabled ? textures.displacementMap : undefined
      }
      displacementScale={displacementScale}
      bumpMap={!qualitySelection.displacementEnabled ? textures.displacementMap : undefined}
      bumpScale={bumpScale}
      color="#ffffff"
      roughness={body.surface.style === "earth" ? 0.58 : 0.84}
      metalness={0}
    />
  );
}

function TexturedSunMaterial({
  body,
  variant
}: {
  body: CelestialBodyConfig;
  variant: SurfaceQualitySelection["variant"];
}) {
  const materialRef = useRef<ShaderMaterial>(null);
  const texture = useTexture(variant.albedo) as Texture;
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uBaseColor: { value: new Color(body.surface.baseColor) },
      uSecondaryColor: { value: new Color(body.surface.secondaryColor) },
      uTime: { value: 0 }
    }),
    [body, texture]
  );

  useEffect(() => {
    configureColorTexture(texture);
  }, [texture]);

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
      fragmentShader={texturedSunFragmentShader}
      toneMapped={false}
    />
  );
}

export function ProceduralBodyMaterial({
  body,
  targetObjectRef,
  sunObjectRef
}: {
  body: CelestialBodyConfig;
  targetObjectRef?: SceneObjectRef;
  sunObjectRef?: SceneObjectRef;
}) {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uBaseColor: { value: new Color(body.surface.baseColor) },
      uSecondaryColor: { value: new Color(body.surface.secondaryColor) },
      uAtmosphereColor: {
        value: new Color(body.surface.atmosphereColor ?? body.surface.secondaryColor)
      },
      uLightDirection: { value: new Vector3(0.35, 0.42, 0.82) },
      uStyle: { value: styleIds[body.surface.style] },
      uTime: { value: 0 }
    }),
    [body]
  );

  useSunLightDirectionUniform(materialRef, targetObjectRef, sunObjectRef);

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

export function SurfaceOverlayLayers({
  body,
  textureSet,
  qualitySelection,
  radius,
  sunObjectRef
}: {
  body: CelestialBodyConfig;
  textureSet?: SurfaceTextureSet;
  qualitySelection?: SurfaceQualitySelection;
  radius: number;
  sunObjectRef?: SceneObjectRef;
}) {
  const variant = qualitySelection?.variant;

  if (!textureSet || !variant) {
    return null;
  }

  return (
    <>
      {body.id === "earth" && variant.night ? (
        <NightLightsShell
          texturePath={variant.night}
          radius={radius}
          sunObjectRef={sunObjectRef}
        />
      ) : null}
      {body.id === "earth" && variant.clouds ? (
        <CloudShell texturePath={variant.clouds} radius={radius} />
      ) : null}
    </>
  );
}

function CloudShell({
  texturePath,
  radius
}: {
  texturePath: string;
  radius: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(texturePath) as Texture;

  useEffect(() => {
    configureColorTexture(texture);
  }, [texture]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.025;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.018}>
      <sphereGeometry args={[radius, 128, 64]} />
      <meshStandardMaterial
        color="#ffffff"
        map={texture}
        alphaMap={texture}
        transparent
        opacity={0.46}
        roughness={1}
        metalness={0}
        depthWrite={false}
        side={DoubleSide}
      />
    </mesh>
  );
}

function NightLightsShell({
  texturePath,
  radius,
  sunObjectRef
}: {
  texturePath: string;
  radius: number;
  sunObjectRef?: SceneObjectRef;
}) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const texture = useTexture(texturePath) as Texture;
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uLightDirection: { value: new Vector3(0.35, 0.42, 0.82) },
      uOpacity: { value: 0.92 }
    }),
    [texture]
  );

  useEffect(() => {
    configureColorTexture(texture);
  }, [texture]);

  useSunLightDirectionUniform(materialRef, meshRef, sunObjectRef);

  return (
    <mesh ref={meshRef} scale={1.006}>
      <sphereGeometry args={[radius, 96, 48]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={nightLightsFragmentShader}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

export function AtmosphereShell({
  color,
  radius,
  opacity = 0.16,
  sunObjectRef
}: {
  color: string;
  radius: number;
  opacity?: number;
  sunObjectRef?: SceneObjectRef;
}) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(color) },
      uLightDirection: { value: new Vector3(0.35, 0.42, 0.82) },
      uOpacity: { value: opacity }
    }),
    [color, opacity]
  );

  useSunLightDirectionUniform(materialRef, meshRef, sunObjectRef);

  return (
    <mesh ref={meshRef} scale={1.08}>
      <sphereGeometry args={[radius, 48, 24]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={atmosphereFragmentShader}
        transparent
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
