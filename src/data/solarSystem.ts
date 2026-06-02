import type {
  CelestialBodyConfig,
  SelectionTarget,
  SmallBodyPopulationConfig
} from "../types";

export const knownPlanetarySatelliteCounts: Record<string, number> = {
  earth: 1,
  mars: 2,
  jupiter: 115,
  saturn: 292,
  uranus: 29,
  neptune: 16
};

export const bodies: CelestialBodyConfig[] = [
  {
    id: "sun",
    nameZh: "太阳",
    nameEn: "Sun",
    kind: "star",
    radiusKm: 695700,
    rotation: { periodHours: 609.12, axialTiltDeg: 7.25 },
    surface: {
      style: "sun",
      baseColor: "#ffb347",
      secondaryColor: "#fff3a3",
      emissiveColor: "#ff6a00",
      textureSet: "sun"
    },
    descriptionZh:
      "太阳会自转，并且存在差速自转；这里用旋转噪声、日冕、耀斑和粒子表现聚变活动。"
  },
  {
    id: "mercury",
    nameZh: "水星",
    nameEn: "Mercury",
    kind: "planet",
    parentId: "sun",
    radiusKm: 2439.7,
    meanDistanceAU: 0.38709937,
    orbit: {
      semiMajorAxisAU: 0.38709937,
      periodDays: 87.969,
      eccentricity: 0.20564096,
      inclinationDeg: 7.00340792,
      longitudeOfAscendingNodeDeg: 48.29765571,
      argumentOfPeriapsisDeg: 29.20253239,
      phaseDeg: 59.68089973
    },
    rotation: { periodHours: 1407.6, axialTiltDeg: 0.03 },
    surface: {
      style: "mercury",
      baseColor: "#8f8a80",
      secondaryColor: "#c0b8a8",
      textureSet: "mercury"
    },
    descriptionZh: "布满撞击坑的岩质行星，轨道偏心率明显。"
  },
  {
    id: "venus",
    nameZh: "金星",
    nameEn: "Venus",
    kind: "planet",
    parentId: "sun",
    radiusKm: 6051.8,
    meanDistanceAU: 0.72333669,
    orbit: {
      semiMajorAxisAU: 0.72333669,
      periodDays: 224.701,
      eccentricity: 0.00676587,
      inclinationDeg: 3.39446765,
      longitudeOfAscendingNodeDeg: 76.60648643,
      argumentOfPeriapsisDeg: 54.99668957,
      phaseDeg: 28.53175551
    },
    rotation: { periodHours: 5832.5, axialTiltDeg: 177.4, retrograde: true },
    surface: {
      style: "venus",
      baseColor: "#d8b46a",
      secondaryColor: "#fff0b1",
      atmosphereColor: "#ffdf8a",
      textureSet: "venus"
    },
    descriptionZh: "厚重云层覆盖的高温行星，自转方向与大多数行星相反。"
  },
  {
    id: "earth",
    nameZh: "地球",
    nameEn: "Earth",
    kind: "planet",
    parentId: "sun",
    radiusKm: 6371,
    meanDistanceAU: 1.00000409,
    orbit: {
      semiMajorAxisAU: 1.00000409,
      periodDays: 365.256,
      eccentricity: 0.01669963,
      inclinationDeg: -0.00343532,
      longitudeOfAscendingNodeDeg: 0,
      argumentOfPeriapsisDeg: 103.02307839,
      phaseDeg: 147.09091372
    },
    rotation: { periodHours: 23.934, axialTiltDeg: 23.44 },
    surface: {
      style: "earth",
      baseColor: "#2362a3",
      secondaryColor: "#52ad76",
      atmosphereColor: "#8fd5ff",
      textureSet: "earth"
    },
    descriptionZh: "拥有海洋、陆地、云层和月球的岩质行星。"
  },
  {
    id: "moon",
    nameZh: "月球",
    nameEn: "Moon",
    kind: "moon",
    parentId: "earth",
    radiusKm: 1737.4,
    orbit: {
      semiMajorAxisKm: 384400,
      periodDays: 27.322,
      eccentricity: 0.0549,
      inclinationDeg: 5.14,
      phaseDeg: 20
    },
    rotation: { periodHours: 655.7, axialTiltDeg: 6.68 },
    surface: {
      style: "moon",
      baseColor: "#8b8980",
      secondaryColor: "#d1cec2",
      textureSet: "moon"
    },
    descriptionZh: "地球唯一的天然卫星，这里保留同步自转的慢速视觉效果。"
  },
  {
    id: "mars",
    nameZh: "火星",
    nameEn: "Mars",
    kind: "planet",
    parentId: "sun",
    radiusKm: 3389.5,
    meanDistanceAU: 1.52371522,
    orbit: {
      semiMajorAxisAU: 1.52371522,
      periodDays: 686.98,
      eccentricity: 0.09341492,
      inclinationDeg: 1.84754344,
      longitudeOfAscendingNodeDeg: 49.48225226,
      argumentOfPeriapsisDeg: 286.69151441,
      phaseDeg: 35.40450439
    },
    rotation: { periodHours: 24.623, axialTiltDeg: 25.19 },
    surface: {
      style: "mars",
      baseColor: "#b35132",
      secondaryColor: "#f0b07a",
      atmosphereColor: "#d98a5f",
      textureSet: "mars"
    },
    descriptionZh: "红色沙尘与极冠明显，拥有火卫一和火卫二。"
  },
  {
    id: "phobos",
    nameZh: "火卫一",
    nameEn: "Phobos",
    kind: "moon",
    parentId: "mars",
    radiusKm: 11.1,
    orbit: {
      semiMajorAxisKm: 9376,
      periodDays: 0.319,
      eccentricity: 0.0151,
      inclinationDeg: 1.08,
      phaseDeg: 45
    },
    rotation: { periodHours: 7.66, axialTiltDeg: 0 },
    surface: {
      style: "rock",
      baseColor: "#6d6258",
      secondaryColor: "#a39686",
      textureSet: "phobos"
    },
    descriptionZh: "火星内侧小卫星，形状在视觉上以粗糙小天体表现。"
  },
  {
    id: "deimos",
    nameZh: "火卫二",
    nameEn: "Deimos",
    kind: "moon",
    parentId: "mars",
    radiusKm: 6.2,
    orbit: {
      semiMajorAxisKm: 23463,
      periodDays: 1.263,
      eccentricity: 0.0002,
      inclinationDeg: 1.79,
      phaseDeg: 210
    },
    rotation: { periodHours: 30.31, axialTiltDeg: 0 },
    surface: {
      style: "rock",
      baseColor: "#7d7468",
      secondaryColor: "#aaa091",
      textureSet: "deimos"
    },
    descriptionZh: "火星外侧小卫星。"
  },
  {
    id: "jupiter",
    nameZh: "木星",
    nameEn: "Jupiter",
    kind: "planet",
    parentId: "sun",
    radiusKm: 69911,
    meanDistanceAU: 5.20285634,
    orbit: {
      semiMajorAxisAU: 5.20285634,
      periodDays: 4332.59,
      eccentricity: 0.04835123,
      inclinationDeg: 1.30391165,
      longitudeOfAscendingNodeDeg: 100.52798059,
      argumentOfPeriapsisDeg: 274.25664061,
      phaseDeg: 101.27500927
    },
    rotation: { periodHours: 9.925, axialTiltDeg: 3.13 },
    surface: {
      style: "jupiter",
      baseColor: "#d7a86e",
      secondaryColor: "#f2e0c2",
      textureSet: "jupiter"
    },
    rings: {
      innerRadiusKm: 92_000,
      outerRadiusKm: 226_000,
      color: "#bfa890",
      opacity: 0.23,
      bandCount: 3
    },
    irregularSatellites: {
      labelZh: "木星不规则卫星群",
      count: 107,
      minOrbitKm: 6_000_000,
      maxOrbitKm: 32_000_000,
      color: "#d7c49c",
      seed: 4101,
      retrogradeRatio: 0.72,
      inclinationDeg: 28
    },
    descriptionZh: "太阳系最大行星，云带和大红斑是最重要的外部特征。"
  },
  {
    id: "io",
    nameZh: "木卫一",
    nameEn: "Io",
    kind: "moon",
    parentId: "jupiter",
    radiusKm: 1821.6,
    orbit: { semiMajorAxisKm: 421700, periodDays: 1.769, inclinationDeg: 0.05 },
    rotation: { periodHours: 42.46, axialTiltDeg: 0 },
    surface: {
      style: "rock",
      baseColor: "#e0b44f",
      secondaryColor: "#fff0a5",
      textureSet: "io"
    },
    descriptionZh: "火山活动强烈的木星卫星。"
  },
  {
    id: "europa",
    nameZh: "木卫二",
    nameEn: "Europa",
    kind: "moon",
    parentId: "jupiter",
    radiusKm: 1560.8,
    orbit: {
      semiMajorAxisKm: 671100,
      periodDays: 3.551,
      inclinationDeg: 0.47,
      phaseDeg: 90
    },
    rotation: { periodHours: 85.23, axialTiltDeg: 0.1 },
    surface: {
      style: "ice",
      baseColor: "#cfd8d9",
      secondaryColor: "#9c785f",
      textureSet: "europa"
    },
    descriptionZh: "冰壳下可能存在海洋的伽利略卫星。"
  },
  {
    id: "ganymede",
    nameZh: "木卫三",
    nameEn: "Ganymede",
    kind: "moon",
    parentId: "jupiter",
    radiusKm: 2634.1,
    orbit: {
      semiMajorAxisKm: 1_070_400,
      periodDays: 7.155,
      inclinationDeg: 0.2,
      phaseDeg: 180
    },
    rotation: { periodHours: 171.7, axialTiltDeg: 0.2 },
    surface: {
      style: "ice",
      baseColor: "#8f8b83",
      secondaryColor: "#d7d3c8",
      textureSet: "ganymede"
    },
    descriptionZh: "太阳系最大的卫星。"
  },
  {
    id: "callisto",
    nameZh: "木卫四",
    nameEn: "Callisto",
    kind: "moon",
    parentId: "jupiter",
    radiusKm: 2410.3,
    orbit: {
      semiMajorAxisKm: 1_882_700,
      periodDays: 16.689,
      inclinationDeg: 0.28,
      phaseDeg: 270
    },
    rotation: { periodHours: 400.5, axialTiltDeg: 0.4 },
    surface: {
      style: "ice",
      baseColor: "#5b5851",
      secondaryColor: "#b6b1a4",
      textureSet: "callisto"
    },
    descriptionZh: "布满古老撞击坑的伽利略卫星。"
  },
  {
    id: "amalthea",
    nameZh: "木卫五",
    nameEn: "Amalthea",
    kind: "moon",
    parentId: "jupiter",
    radiusKm: 83.5,
    orbit: {
      semiMajorAxisKm: 181_400,
      periodDays: 0.498,
      inclinationDeg: 0.37,
      phaseDeg: 36
    },
    rotation: { periodHours: 11.95, axialTiltDeg: 0 },
    surface: {
      style: "rock",
      baseColor: "#8e4d3a",
      secondaryColor: "#d48b62"
    },
    descriptionZh: "木星内侧红色小卫星。"
  },
  {
    id: "himalia",
    nameZh: "希玛利亚",
    nameEn: "Himalia",
    kind: "moon",
    parentId: "jupiter",
    radiusKm: 85,
    orbit: {
      semiMajorAxisKm: 11_460_000,
      periodDays: 250.56,
      inclinationDeg: 27.5,
      phaseDeg: 128
    },
    rotation: { periodHours: 7.8, axialTiltDeg: 0 },
    surface: {
      style: "rock",
      baseColor: "#8c7b63",
      secondaryColor: "#b9a98c"
    },
    descriptionZh: "木星外侧不规则卫星代表。"
  },
  {
    id: "elara",
    nameZh: "厄拉拉",
    nameEn: "Elara",
    kind: "moon",
    parentId: "jupiter",
    radiusKm: 43,
    orbit: {
      semiMajorAxisKm: 11_740_000,
      periodDays: 259.65,
      inclinationDeg: 26.6,
      phaseDeg: 196
    },
    rotation: { periodHours: 12, axialTiltDeg: 0 },
    surface: {
      style: "rock",
      baseColor: "#786f63",
      secondaryColor: "#afa28f"
    },
    descriptionZh: "木星不规则卫星代表。"
  },
  {
    id: "thebe",
    nameZh: "忒拜",
    nameEn: "Thebe",
    kind: "moon",
    parentId: "jupiter",
    radiusKm: 49.3,
    orbit: {
      semiMajorAxisKm: 221_900,
      periodDays: 0.675,
      inclinationDeg: 1.08,
      phaseDeg: 300
    },
    rotation: { periodHours: 16.2, axialTiltDeg: 0 },
    surface: {
      style: "rock",
      baseColor: "#7c4a39",
      secondaryColor: "#b97961"
    },
    descriptionZh: "木星内侧小卫星。"
  },
  {
    id: "saturn",
    nameZh: "土星",
    nameEn: "Saturn",
    kind: "planet",
    parentId: "sun",
    radiusKm: 58232,
    meanDistanceAU: 9.53634558,
    orbit: {
      semiMajorAxisAU: 9.53634558,
      periodDays: 10759.22,
      eccentricity: 0.05372709,
      inclinationDeg: 2.48650331,
      longitudeOfAscendingNodeDeg: 113.58616687,
      argumentOfPeriapsisDeg: 338.90203511,
      phaseDeg: 280.40183176
    },
    rotation: { periodHours: 10.656, axialTiltDeg: 26.73 },
    surface: {
      style: "saturn",
      baseColor: "#d8c18f",
      secondaryColor: "#f5e8c4",
      textureSet: "saturn"
    },
    rings: {
      innerRadiusKm: 74_500,
      outerRadiusKm: 140_220,
      color: "#d9c79b",
      secondaryColor: "#8e765a",
      opacity: 0.58,
      bandCount: 12
    },
    irregularSatellites: {
      labelZh: "土星不规则卫星群",
      count: 280,
      minOrbitKm: 3_500_000,
      maxOrbitKm: 31_000_000,
      color: "#cdbf9b",
      seed: 6202,
      retrogradeRatio: 0.78,
      inclinationDeg: 38
    },
    descriptionZh: "环系统最醒目的巨行星，冰岩碎屑环会以半透明多带结构呈现。"
  },
  {
    id: "mimas",
    nameZh: "土卫一",
    nameEn: "Mimas",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 198.2,
    orbit: { semiMajorAxisKm: 185_540, periodDays: 0.942, phaseDeg: 20 },
    rotation: { periodHours: 22.6, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#a9a9a1",
      secondaryColor: "#dfded4",
      textureSet: "mimas"
    },
    descriptionZh: "有巨大撞击坑的小型冰卫星。"
  },
  {
    id: "enceladus",
    nameZh: "土卫二",
    nameEn: "Enceladus",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 252.1,
    orbit: {
      semiMajorAxisKm: 238_040,
      periodDays: 1.37,
      phaseDeg: 60
    },
    rotation: { periodHours: 32.9, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#d6e2e5",
      secondaryColor: "#ffffff",
      textureSet: "enceladus"
    },
    descriptionZh: "明亮冰壳和喷流让它在土星系统中非常醒目。"
  },
  {
    id: "tethys",
    nameZh: "土卫三",
    nameEn: "Tethys",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 531.1,
    orbit: {
      semiMajorAxisKm: 294_670,
      periodDays: 1.888,
      phaseDeg: 105
    },
    rotation: { periodHours: 45.3, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#bfc3bd",
      secondaryColor: "#ecebe1",
      textureSet: "tethys"
    },
    descriptionZh: "土星主要冰卫星之一。"
  },
  {
    id: "dione",
    nameZh: "土卫四",
    nameEn: "Dione",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 561.4,
    orbit: {
      semiMajorAxisKm: 377_420,
      periodDays: 2.737,
      phaseDeg: 150
    },
    rotation: { periodHours: 65.7, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#a8aba4",
      secondaryColor: "#e4e2d8",
      textureSet: "dione"
    },
    descriptionZh: "土星主要冰卫星之一。"
  },
  {
    id: "rhea",
    nameZh: "土卫五",
    nameEn: "Rhea",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 763.8,
    orbit: {
      semiMajorAxisKm: 527_070,
      periodDays: 4.518,
      phaseDeg: 205
    },
    rotation: { periodHours: 108.4, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#969890",
      secondaryColor: "#d7d7ce",
      textureSet: "rhea"
    },
    descriptionZh: "土星第二大卫星。"
  },
  {
    id: "titan",
    nameZh: "泰坦",
    nameEn: "Titan",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 2574.7,
    orbit: {
      semiMajorAxisKm: 1_221_870,
      periodDays: 15.945,
      phaseDeg: 260
    },
    rotation: { periodHours: 382.7, axialTiltDeg: 0.3 },
    surface: {
      style: "venus",
      baseColor: "#b98742",
      secondaryColor: "#f0c16f",
      atmosphereColor: "#ffbd68",
      textureSet: "titan"
    },
    descriptionZh: "拥有浓厚大气和甲烷湖海的巨型卫星。"
  },
  {
    id: "hyperion",
    nameZh: "土卫七",
    nameEn: "Hyperion",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 135,
    orbit: {
      semiMajorAxisKm: 1_500_880,
      periodDays: 21.277,
      phaseDeg: 315
    },
    rotation: { periodHours: 312, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#92785a", secondaryColor: "#c7aa83" },
    descriptionZh: "不规则形状明显的土星卫星。"
  },
  {
    id: "iapetus",
    nameZh: "土卫八",
    nameEn: "Iapetus",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 734.5,
    orbit: {
      semiMajorAxisKm: 3_560_820,
      periodDays: 79.32,
      inclinationDeg: 15.5,
      phaseDeg: 5
    },
    rotation: { periodHours: 1903.7, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#5b5249",
      secondaryColor: "#e5e2d8",
      textureSet: "iapetus"
    },
    descriptionZh: "明暗两半球差异明显。"
  },
  {
    id: "phoebe",
    nameZh: "菲比",
    nameEn: "Phoebe",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 106.5,
    orbit: {
      semiMajorAxisKm: 12_947_780,
      periodDays: 550.48,
      inclinationDeg: 175.2,
      phaseDeg: 75,
      retrograde: true
    },
    rotation: { periodHours: 9.27, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#56514b", secondaryColor: "#8b8377" },
    descriptionZh: "逆行不规则卫星代表。"
  },
  {
    id: "janus",
    nameZh: "雅努斯",
    nameEn: "Janus",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 89.5,
    orbit: {
      semiMajorAxisKm: 151_500,
      periodDays: 0.695,
      phaseDeg: 112
    },
    rotation: { periodHours: 16.7, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#82766a", secondaryColor: "#b8aa99" },
    descriptionZh: "土星内侧小卫星。"
  },
  {
    id: "epimetheus",
    nameZh: "厄庇墨透斯",
    nameEn: "Epimetheus",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 58.1,
    orbit: {
      semiMajorAxisKm: 151_410,
      periodDays: 0.694,
      phaseDeg: 190
    },
    rotation: { periodHours: 16.7, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#756d63", secondaryColor: "#ada294" },
    descriptionZh: "与雅努斯共轨的土星卫星。"
  },
  {
    id: "pan",
    nameZh: "潘",
    nameEn: "Pan",
    kind: "moon",
    parentId: "saturn",
    radiusKm: 14.1,
    orbit: {
      semiMajorAxisKm: 133_584,
      periodDays: 0.575,
      phaseDeg: 250
    },
    rotation: { periodHours: 13.8, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#8a8172", secondaryColor: "#c8bcaa" },
    descriptionZh: "土星环缝中的牧羊卫星。"
  },
  {
    id: "uranus",
    nameZh: "天王星",
    nameEn: "Uranus",
    kind: "planet",
    parentId: "sun",
    radiusKm: 25362,
    meanDistanceAU: 19.18864642,
    orbit: {
      semiMajorAxisAU: 19.18864642,
      periodDays: 30685.4,
      eccentricity: 0.04724582,
      inclinationDeg: 0.77199608,
      longitudeOfAscendingNodeDeg: 74.02812703,
      argumentOfPeriapsisDeg: 97.03394112,
      phaseDeg: 255.36450578
    },
    rotation: { periodHours: 17.24, axialTiltDeg: 97.77, retrograde: true },
    surface: {
      style: "uranus",
      baseColor: "#80d8d8",
      secondaryColor: "#c8ffff",
      atmosphereColor: "#a7fff4",
      textureSet: "uranus"
    },
    rings: {
      innerRadiusKm: 38_000,
      outerRadiusKm: 98_000,
      color: "#a4e1dd",
      opacity: 0.25,
      bandCount: 8
    },
    irregularSatellites: {
      labelZh: "天王星小卫星群",
      count: 21,
      minOrbitKm: 45_000,
      maxOrbitKm: 21_000_000,
      color: "#a7dad8",
      seed: 7303,
      retrogradeRatio: 0.35,
      inclinationDeg: 74
    },
    descriptionZh: "几乎横躺着自转的冰巨星，环系统也随轴倾角显著倾斜。"
  },
  {
    id: "miranda",
    nameZh: "米兰达",
    nameEn: "Miranda",
    kind: "moon",
    parentId: "uranus",
    radiusKm: 235.8,
    orbit: { semiMajorAxisKm: 129_900, periodDays: 1.413, phaseDeg: 30 },
    rotation: { periodHours: 33.9, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#8b8c85",
      secondaryColor: "#d1d0c5",
      textureSet: "miranda"
    },
    descriptionZh: "地形破碎感强烈的天王星卫星。"
  },
  {
    id: "ariel",
    nameZh: "艾瑞尔",
    nameEn: "Ariel",
    kind: "moon",
    parentId: "uranus",
    radiusKm: 578.9,
    orbit: { semiMajorAxisKm: 190_900, periodDays: 2.52, phaseDeg: 80 },
    rotation: { periodHours: 60.5, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#a3a79f",
      secondaryColor: "#dfded4",
      textureSet: "ariel"
    },
    descriptionZh: "天王星主要卫星之一。"
  },
  {
    id: "umbriel",
    nameZh: "乌姆布里尔",
    nameEn: "Umbriel",
    kind: "moon",
    parentId: "uranus",
    radiusKm: 584.7,
    orbit: { semiMajorAxisKm: 266_000, periodDays: 4.144, phaseDeg: 130 },
    rotation: { periodHours: 99.5, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#555a57",
      secondaryColor: "#979d96",
      textureSet: "umbriel"
    },
    descriptionZh: "较暗的天王星主要卫星。"
  },
  {
    id: "titania",
    nameZh: "泰坦尼亚",
    nameEn: "Titania",
    kind: "moon",
    parentId: "uranus",
    radiusKm: 788.9,
    orbit: { semiMajorAxisKm: 436_300, periodDays: 8.706, phaseDeg: 190 },
    rotation: { periodHours: 208.9, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#8e9088",
      secondaryColor: "#cfcec4",
      textureSet: "titania"
    },
    descriptionZh: "天王星最大的卫星。"
  },
  {
    id: "oberon",
    nameZh: "奥伯龙",
    nameEn: "Oberon",
    kind: "moon",
    parentId: "uranus",
    radiusKm: 761.4,
    orbit: { semiMajorAxisKm: 583_500, periodDays: 13.463, phaseDeg: 245 },
    rotation: { periodHours: 323.1, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#6b6d66",
      secondaryColor: "#b8b7ad",
      textureSet: "oberon"
    },
    descriptionZh: "天王星外侧主要卫星。"
  },
  {
    id: "puck",
    nameZh: "帕克",
    nameEn: "Puck",
    kind: "moon",
    parentId: "uranus",
    radiusKm: 81,
    orbit: { semiMajorAxisKm: 86_000, periodDays: 0.762, phaseDeg: 300 },
    rotation: { periodHours: 18.3, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#787d78", secondaryColor: "#adb3ac" },
    descriptionZh: "天王星内侧小卫星。"
  },
  {
    id: "portia",
    nameZh: "波西亚",
    nameEn: "Portia",
    kind: "moon",
    parentId: "uranus",
    radiusKm: 67.6,
    orbit: { semiMajorAxisKm: 66_100, periodDays: 0.513, phaseDeg: 18 },
    rotation: { periodHours: 12.3, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#72766f", secondaryColor: "#a9aea4" },
    descriptionZh: "天王星内侧小卫星。"
  },
  {
    id: "mab",
    nameZh: "马布",
    nameEn: "Mab",
    kind: "moon",
    parentId: "uranus",
    radiusKm: 12,
    orbit: { semiMajorAxisKm: 97_700, periodDays: 0.923, phaseDeg: 150 },
    rotation: { periodHours: 22.1, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#6d746f", secondaryColor: "#9ca8a0" },
    descriptionZh: "天王星小卫星代表。"
  },
  {
    id: "neptune",
    nameZh: "海王星",
    nameEn: "Neptune",
    kind: "planet",
    parentId: "sun",
    radiusKm: 24622,
    meanDistanceAU: 30.06999221,
    orbit: {
      semiMajorAxisAU: 30.06999221,
      periodDays: 60190,
      eccentricity: 0.00860397,
      inclinationDeg: 1.77013691,
      longitudeOfAscendingNodeDeg: 131.78288205,
      argumentOfPeriapsisDeg: 273.09671068,
      phaseDeg: 317.7089617
    },
    rotation: { periodHours: 16.11, axialTiltDeg: 28.32 },
    surface: {
      style: "neptune",
      baseColor: "#3359c7",
      secondaryColor: "#7aa8ff",
      atmosphereColor: "#77a9ff",
      textureSet: "neptune"
    },
    rings: {
      innerRadiusKm: 41_900,
      outerRadiusKm: 63_000,
      color: "#8aa2d9",
      opacity: 0.18,
      bandCount: 5
    },
    irregularSatellites: {
      labelZh: "海王星小卫星群",
      count: 10,
      minOrbitKm: 48_000,
      maxOrbitKm: 50_000_000,
      color: "#8aa6ff",
      seed: 8404,
      retrogradeRatio: 0.55,
      inclinationDeg: 45
    },
    descriptionZh: "深蓝色冰巨星，风暴和高速大气流是主要视觉特征。"
  },
  {
    id: "triton",
    nameZh: "海卫一",
    nameEn: "Triton",
    kind: "moon",
    parentId: "neptune",
    radiusKm: 1353.4,
    orbit: {
      semiMajorAxisKm: 354_800,
      periodDays: 5.877,
      inclinationDeg: 156.9,
      retrograde: true,
      phaseDeg: 45
    },
    rotation: { periodHours: 141, axialTiltDeg: 0 },
    surface: {
      style: "ice",
      baseColor: "#b7c7c6",
      secondaryColor: "#f0ded0",
      textureSet: "triton"
    },
    descriptionZh: "逆行的大型海王星卫星。"
  },
  {
    id: "nereid",
    nameZh: "海卫二",
    nameEn: "Nereid",
    kind: "moon",
    parentId: "neptune",
    radiusKm: 170,
    orbit: {
      semiMajorAxisKm: 5_513_400,
      periodDays: 360.14,
      eccentricity: 0.75,
      inclinationDeg: 7.2,
      phaseDeg: 120
    },
    rotation: { periodHours: 11.5, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#777c7c", secondaryColor: "#b9c3c1" },
    descriptionZh: "轨道偏心率很高的海王星卫星。"
  },
  {
    id: "proteus",
    nameZh: "普罗透斯",
    nameEn: "Proteus",
    kind: "moon",
    parentId: "neptune",
    radiusKm: 210,
    orbit: { semiMajorAxisKm: 117_600, periodDays: 1.122, phaseDeg: 210 },
    rotation: { periodHours: 26.9, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#515760", secondaryColor: "#89909a" },
    descriptionZh: "海王星内侧较大不规则卫星。"
  },
  {
    id: "larissa",
    nameZh: "拉里萨",
    nameEn: "Larissa",
    kind: "moon",
    parentId: "neptune",
    radiusKm: 97,
    orbit: { semiMajorAxisKm: 73_500, periodDays: 0.555, phaseDeg: 300 },
    rotation: { periodHours: 13.3, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#48505a", secondaryColor: "#7c8792" },
    descriptionZh: "海王星内侧卫星。"
  },
  {
    id: "galatea",
    nameZh: "伽拉忒亚",
    nameEn: "Galatea",
    kind: "moon",
    parentId: "neptune",
    radiusKm: 88,
    orbit: { semiMajorAxisKm: 61_953, periodDays: 0.429, phaseDeg: 20 },
    rotation: { periodHours: 10.3, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#4b535f", secondaryColor: "#8390a0" },
    descriptionZh: "海王星内侧卫星。"
  },
  {
    id: "hippocamp",
    nameZh: "希波坎普",
    nameEn: "Hippocamp",
    kind: "moon",
    parentId: "neptune",
    radiusKm: 17,
    orbit: { semiMajorAxisKm: 105_300, periodDays: 0.95, phaseDeg: 140 },
    rotation: { periodHours: 22.8, axialTiltDeg: 0 },
    surface: { style: "rock", baseColor: "#59606b", secondaryColor: "#8b96a5" },
    descriptionZh: "海王星小卫星代表。"
  },
  {
    id: "ceres",
    nameZh: "谷神星",
    nameEn: "Ceres",
    kind: "dwarf",
    parentId: "sun",
    radiusKm: 469.7,
    meanDistanceAU: 2.77,
    orbit: {
      semiMajorAxisAU: 2.77,
      periodDays: 1682,
      eccentricity: 0.0758,
      inclinationDeg: 10.6,
      longitudeOfAscendingNodeDeg: 80.3,
      argumentOfPeriapsisDeg: 73.6,
      phaseDeg: 45
    },
    rotation: { periodHours: 9.07, axialTiltDeg: 4 },
    surface: { style: "dwarf", baseColor: "#77746b", secondaryColor: "#b9b3a5" },
    descriptionZh: "小行星带中最大的矮行星。"
  },
  {
    id: "pluto",
    nameZh: "冥王星",
    nameEn: "Pluto",
    kind: "dwarf",
    parentId: "sun",
    radiusKm: 1188.3,
    meanDistanceAU: 39.48,
    orbit: {
      semiMajorAxisAU: 39.48,
      periodDays: 90560,
      eccentricity: 0.2488,
      inclinationDeg: 17.16,
      longitudeOfAscendingNodeDeg: 110.3,
      argumentOfPeriapsisDeg: 113.8,
      phaseDeg: 310
    },
    rotation: { periodHours: 153.3, axialTiltDeg: 122.5, retrograde: true },
    surface: { style: "dwarf", baseColor: "#b68c6a", secondaryColor: "#f4d3b0" },
    descriptionZh: "柯伊伯带矮行星，轨道倾角和偏心率都很明显。"
  },
  {
    id: "haumea",
    nameZh: "妊神星",
    nameEn: "Haumea",
    kind: "dwarf",
    parentId: "sun",
    radiusKm: 816,
    meanDistanceAU: 43.2,
    orbit: {
      semiMajorAxisAU: 43.2,
      periodDays: 103774,
      eccentricity: 0.19,
      inclinationDeg: 28.2,
      longitudeOfAscendingNodeDeg: 121.9,
      argumentOfPeriapsisDeg: 239.0,
      phaseDeg: 95
    },
    rotation: { periodHours: 3.92, axialTiltDeg: 0 },
    surface: { style: "ice", baseColor: "#d8dedc", secondaryColor: "#9c8a7b" },
    descriptionZh: "快速自转的柯伊伯带矮行星。"
  },
  {
    id: "makemake",
    nameZh: "鸟神星",
    nameEn: "Makemake",
    kind: "dwarf",
    parentId: "sun",
    radiusKm: 715,
    meanDistanceAU: 45.8,
    orbit: {
      semiMajorAxisAU: 45.8,
      periodDays: 112897,
      eccentricity: 0.16,
      inclinationDeg: 29,
      longitudeOfAscendingNodeDeg: 79.6,
      argumentOfPeriapsisDeg: 295.0,
      phaseDeg: 160
    },
    rotation: { periodHours: 22.8, axialTiltDeg: 0 },
    surface: { style: "dwarf", baseColor: "#b06645", secondaryColor: "#e9a67e" },
    descriptionZh: "偏红色的柯伊伯带矮行星。"
  },
  {
    id: "eris",
    nameZh: "阋神星",
    nameEn: "Eris",
    kind: "dwarf",
    parentId: "sun",
    radiusKm: 1163,
    meanDistanceAU: 67.7,
    orbit: {
      semiMajorAxisAU: 67.7,
      periodDays: 203830,
      eccentricity: 0.44,
      inclinationDeg: 44.0,
      longitudeOfAscendingNodeDeg: 35.95,
      argumentOfPeriapsisDeg: 151.6,
      phaseDeg: 250
    },
    rotation: { periodHours: 25.9, axialTiltDeg: 0 },
    surface: { style: "ice", baseColor: "#cdd8d5", secondaryColor: "#ffffff" },
    descriptionZh: "远离太阳的高倾角矮行星。"
  }
];

export const smallBodyPopulations: SmallBodyPopulationConfig[] = [
  {
    id: "asteroid-belt",
    nameZh: "小行星带",
    count: 4200,
    minAU: 2.05,
    maxAU: 3.35,
    verticalSpreadAU: 0.08,
    color: "#b8a58e",
    opacity: 0.72,
    pointSize: 0.045,
    seed: 1101,
    distribution: "belt",
    focusAU: 2.7,
    descriptionZh: "火星与木星之间的岩质小天体带。"
  },
  {
    id: "jupiter-trojans",
    nameZh: "木星特洛伊群",
    count: 2400,
    minAU: 5.0,
    maxAU: 5.45,
    verticalSpreadAU: 0.16,
    color: "#c6aa76",
    opacity: 0.62,
    pointSize: 0.05,
    seed: 2102,
    distribution: "trojan",
    focusAU: 5.2,
    descriptionZh: "木星轨道前后 60 度附近的两组小天体。"
  },
  {
    id: "kuiper-belt",
    nameZh: "柯伊伯带",
    count: 5600,
    minAU: 35,
    maxAU: 55,
    verticalSpreadAU: 1.2,
    color: "#83c7ff",
    opacity: 0.58,
    pointSize: 0.055,
    seed: 3103,
    distribution: "distant-belt",
    focusAU: 44,
    descriptionZh: "海王星之外的冰质小天体环带。"
  },
  {
    id: "scattered-disc",
    nameZh: "离散盘",
    count: 2400,
    minAU: 45,
    maxAU: 120,
    verticalSpreadAU: 8,
    color: "#b3d8ff",
    opacity: 0.45,
    pointSize: 0.045,
    seed: 4104,
    distribution: "distant-belt",
    focusAU: 90,
    descriptionZh: "轨道更拉长、更倾斜的远日冰体群。"
  },
  {
    id: "comet-streams",
    nameZh: "彗星轨道流",
    count: 700,
    minAU: 1.5,
    maxAU: 80,
    verticalSpreadAU: 16,
    color: "#d8f3ff",
    opacity: 0.5,
    pointSize: 0.05,
    seed: 5105,
    distribution: "comet",
    focusAU: 16,
    descriptionZh: "以稀疏点流表现高偏心率彗星路径。"
  },
  {
    id: "oort-cloud",
    nameZh: "奥尔特星云",
    count: 9000,
    minAU: 2000,
    maxAU: 100000,
    verticalSpreadAU: 100000,
    color: "#dfe9ff",
    opacity: 0.34,
    pointSize: 0.052,
    seed: 6106,
    distribution: "spherical-cloud",
    focusAU: 18000,
    descriptionZh: "以对数压缩壳层表现太阳引力影响边缘的巨大冰体云。"
  }
];

export const futureExternalLayers = [
  "deep-space-fleet",
  "interstellar-probe",
  "orbital-fleet",
  "space-elevator"
] as const;

export const bodiesById = Object.fromEntries(bodies.map((body) => [body.id, body]));

export const childrenByParent = bodies.reduce<Record<string, CelestialBodyConfig[]>>(
  (acc, body) => {
    if (!body.parentId) {
      return acc;
    }
    acc[body.parentId] ??= [];
    acc[body.parentId].push(body);
    return acc;
  },
  {}
);

export const selectionTargets: SelectionTarget[] = [
  ...bodies.map((body) => ({
    id: body.id,
    label: `${body.nameZh} / ${body.nameEn}`,
    type: "body" as const
  })),
  ...smallBodyPopulations.map((population) => ({
    id: population.id,
    label: population.nameZh,
    type: "population" as const
  }))
];

export function modeledMoonCount(parentId: string) {
  return bodies.filter((body) => body.parentId === parentId && body.kind === "moon")
    .length;
}

export function representedSatelliteCount(parentId: string) {
  const parent = bodiesById[parentId];
  return modeledMoonCount(parentId) + (parent.irregularSatellites?.count ?? 0);
}
