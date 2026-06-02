import type * as THREE from "three";

export type BodyKind = "star" | "planet" | "moon" | "dwarf";

export type SurfaceStyle =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "moon"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "ice"
  | "rock"
  | "dwarf";

export interface OrbitConfig {
  semiMajorAxisAU?: number;
  semiMajorAxisKm?: number;
  periodDays: number;
  eccentricity?: number;
  inclinationDeg?: number;
  longitudeOfAscendingNodeDeg?: number;
  argumentOfPeriapsisDeg?: number;
  phaseDeg?: number;
  retrograde?: boolean;
}

export interface RotationConfig {
  periodHours: number;
  axialTiltDeg: number;
  retrograde?: boolean;
}

export interface RingConfig {
  innerRadiusKm: number;
  outerRadiusKm: number;
  color: string;
  secondaryColor?: string;
  opacity: number;
  bandCount: number;
}

export interface IrregularSatellitePopulationConfig {
  labelZh: string;
  count: number;
  minOrbitKm: number;
  maxOrbitKm: number;
  color: string;
  seed: number;
  retrogradeRatio: number;
  inclinationDeg: number;
}

export interface CelestialBodyConfig {
  id: string;
  nameZh: string;
  nameEn: string;
  kind: BodyKind;
  parentId?: string;
  radiusKm: number;
  meanDistanceAU?: number;
  orbit?: OrbitConfig;
  rotation?: RotationConfig;
  surface: {
    style: SurfaceStyle;
    baseColor: string;
    secondaryColor: string;
    atmosphereColor?: string;
    emissiveColor?: string;
  };
  rings?: RingConfig;
  irregularSatellites?: IrregularSatellitePopulationConfig;
  descriptionZh: string;
}

export type SmallBodyDistribution =
  | "belt"
  | "trojan"
  | "distant-belt"
  | "spherical-cloud"
  | "comet";

export interface SmallBodyPopulationConfig {
  id: string;
  nameZh: string;
  count: number;
  minAU: number;
  maxAU: number;
  verticalSpreadAU: number;
  color: string;
  opacity: number;
  pointSize: number;
  seed: number;
  distribution: SmallBodyDistribution;
  focusAU: number;
  descriptionZh: string;
}

export interface SelectionTarget {
  id: string;
  label: string;
  type: "body" | "population";
}

export interface TargetRegistration {
  object: THREE.Object3D;
  focusRadius: number;
}
