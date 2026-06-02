import type {
  SurfaceAccuracyKind,
  SurfaceTextureQuality,
  SurfaceTextureSet,
  SurfaceTextureVariant
} from "../types";

type VariantOptions = {
  resolution: [number, number];
  qualityResolutions?: Partial<Record<SurfaceTextureQuality, [number, number]>>;
  hasDisplacement?: boolean;
  hasClouds?: boolean;
  hasNight?: boolean;
};

type TextureSetOptions = {
  id: string;
  accuracyKind: SurfaceAccuracyKind;
  hasMeasuredHeight?: boolean;
  heightScale?: number;
  sourceTitle: string;
  sourceUrl: string;
  credit: string;
  dataTypeZh: string;
  noteZh: string;
  nativeResolution?: [number, number];
  variants: VariantOptions;
};

const qualities: SurfaceTextureQuality[] = ["low", "medium", "high"];

function texturePath(id: string, quality: SurfaceTextureQuality, name: string) {
  return `/textures/bodies/${id}/${quality}/${name}.jpg`;
}

function qualityVariants(id: string, options: VariantOptions) {
  return Object.fromEntries(
    qualities.map((quality) => {
      const variant: SurfaceTextureVariant = {
        albedo: texturePath(id, quality, "albedo"),
        resolution: options.qualityResolutions?.[quality] ?? options.resolution
      };

      if (options.hasDisplacement && quality !== "low") {
        variant.displacement = texturePath(id, quality, "height");
      }
      if (options.hasClouds) {
        variant.clouds = texturePath(id, quality, "clouds");
      }
      if (options.hasNight) {
        variant.night = texturePath(id, quality, "night");
      }

      return [quality, variant];
    })
  ) as Record<SurfaceTextureQuality, SurfaceTextureVariant>;
}

function textureSet(options: TextureSetOptions): SurfaceTextureSet {
  return {
    id: options.id,
    accuracyKind: options.accuracyKind,
    hasMeasuredHeight: options.hasMeasuredHeight ?? false,
    heightScale: options.heightScale,
    sourceMetadata: {
      title: options.sourceTitle,
      url: options.sourceUrl,
      credit: options.credit,
      dataTypeZh: options.dataTypeZh,
      noteZh: options.noteZh,
      nativeResolution: options.nativeResolution
    },
    qualityVariants: qualityVariants(options.id, options.variants)
  };
}

const jplTextureMaps = "https://maps.jpl.nasa.gov/tmaps/";

export const texturedBodyIds = [
  "sun",
  "mercury",
  "venus",
  "earth",
  "moon",
  "mars",
  "phobos",
  "deimos",
  "jupiter",
  "io",
  "europa",
  "ganymede",
  "callisto",
  "saturn",
  "mimas",
  "enceladus",
  "tethys",
  "dione",
  "rhea",
  "titan",
  "iapetus",
  "uranus",
  "miranda",
  "ariel",
  "umbriel",
  "titania",
  "oberon",
  "neptune",
  "triton"
] as const;

export const surfaceTextureSets: Record<string, SurfaceTextureSet> = {
  sun: textureSet({
    id: "sun",
    accuracyKind: "representative",
    sourceTitle: "NASA Solar Dynamics Observatory full-disk solar image",
    sourceUrl: "https://sdo.gsfc.nasa.gov/data/",
    credit: "NASA/SDO and the AIA, EVE, and HMI science teams",
    dataTypeZh: "太阳全日面影像基底",
    noteZh: "太阳不是固体表面；贴图只作为光球活动的影像基底，仍叠加动态 shader。",
    nativeResolution: [4096, 4096],
    variants: { resolution: [4096, 4096] }
  }),
  mercury: textureSet({
    id: "mercury",
    accuracyKind: "measured",
    hasMeasuredHeight: true,
    heightScale: 0.1,
    sourceTitle: "Mercury MESSENGER MDIS global color mosaic and global DEM",
    sourceUrl: "https://astrogeology.usgs.gov/search/map/mercury_messenger_mdis_global_color_mosaic_665m",
    credit: "NASA/JHUAPL/Carnegie Institution of Washington/USGS Astrogeology",
    dataTypeZh: "真实全球影像 + DEM 位移",
    noteZh: "使用 MESSENGER 全球影像与 DEM；浏览器资产使用官方预览压缩版。",
    nativeResolution: [23054, 11527],
    variants: { resolution: [1024, 512], hasDisplacement: true }
  }),
  venus: textureSet({
    id: "venus",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Venus Magellan radar map",
    sourceUrl: `${jplTextureMaps}venus.html`,
    credit: "NASA/JPL/Caltech",
    dataTypeZh: "雷达全球拼图",
    noteZh: "金星可见光被厚云遮蔽；这里用雷达表面图加厚重大气壳表现。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  earth: textureSet({
    id: "earth",
    accuracyKind: "measured",
    hasMeasuredHeight: true,
    heightScale: 0.055,
    sourceTitle: "NASA Blue Marble Next Generation",
    sourceUrl: "https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/",
    credit: "NASA Earth Observatory",
    dataTypeZh: "真实全球影像 + 地形位移",
    noteZh: "使用 Blue Marble 全球底图；云层和夜光为本地辅助贴图。",
    nativeResolution: [21600, 10800],
    variants: {
      resolution: [8192, 4096],
      qualityResolutions: {
        medium: [4096, 2048],
        low: [2048, 1024]
      },
      hasDisplacement: true,
      hasClouds: true,
      hasNight: true
    }
  }),
  moon: textureSet({
    id: "moon",
    accuracyKind: "measured",
    hasMeasuredHeight: true,
    heightScale: 0.09,
    sourceTitle: "LRO LROC WAC global mosaic and LOLA DEM",
    sourceUrl: "https://astrogeology.usgs.gov/search/map/moon_lro_lroc_wac_global_morphology_mosaic_100m",
    credit: "NASA/GSFC/Arizona State University/USGS Astrogeology",
    dataTypeZh: "真实全球影像 + DEM 位移",
    noteZh: "影像来自 LRO WAC 全球拼图；位移来自 LOLA DEM 官方预览压缩版。",
    nativeResolution: [1024, 512],
    variants: { resolution: [1024, 512], hasDisplacement: true }
  }),
  mars: textureSet({
    id: "mars",
    accuracyKind: "measured",
    hasMeasuredHeight: true,
    heightScale: 0.095,
    sourceTitle: "Mars Viking global color mosaic and MGS MOLA DEM",
    sourceUrl: "https://astrogeology.usgs.gov/search/map/mars_viking_global_color_mosaic_925m",
    credit: "NASA/USGS Astrogeology",
    dataTypeZh: "真实全球影像 + DEM 位移",
    noteZh: "影像来自 Viking 全球彩色拼图；位移来自 MOLA DEM 官方预览压缩版。",
    nativeResolution: [23059, 11530],
    variants: { resolution: [1024, 512], hasDisplacement: true }
  }),
  phobos: textureSet({
    id: "phobos",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Phobos Viking mosaic",
    sourceUrl: `${jplTextureMaps}mars.html`,
    credit: "Caltech/JPL/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "贴图为 Viking 影像拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  deimos: textureSet({
    id: "deimos",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Deimos Viking mosaic",
    sourceUrl: `${jplTextureMaps}mars.html`,
    credit: "Caltech/JPL/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "贴图为 Viking 影像拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  jupiter: textureSet({
    id: "jupiter",
    accuracyKind: "representative",
    sourceTitle: "JPL Solar System Simulator Jupiter Voyager texture",
    sourceUrl: `${jplTextureMaps}jupiter.html`,
    credit: "NASA/JPL/Caltech",
    dataTypeZh: "代表性云带贴图",
    noteZh: "木星云带会随真实大气变化；此贴图只代表典型外观，不做地形位移。",
    nativeResolution: [720, 360],
    variants: { resolution: [720, 360] }
  }),
  io: textureSet({
    id: "io",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Io Voyager/Galileo mosaic",
    sourceUrl: `${jplTextureMaps}jupiter.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用 Voyager/Galileo 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  europa: textureSet({
    id: "europa",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Europa Voyager mosaic",
    sourceUrl: `${jplTextureMaps}jupiter.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用清理后的 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  ganymede: textureSet({
    id: "ganymede",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Ganymede Voyager mosaic",
    sourceUrl: `${jplTextureMaps}jupiter.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用清理后的 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  callisto: textureSet({
    id: "callisto",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Callisto Voyager mosaic",
    sourceUrl: `${jplTextureMaps}jupiter.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用清理后的 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  saturn: textureSet({
    id: "saturn",
    accuracyKind: "representative",
    sourceTitle: "JPL Solar System Simulator Saturn representative texture",
    sourceUrl: `${jplTextureMaps}saturn.html`,
    credit: "Don Davis/JPL/Caltech",
    dataTypeZh: "代表性大气贴图",
    noteZh: "JPL 页面标注该土星贴图为虚构/代表性；不做地形位移。",
    nativeResolution: [720, 360],
    variants: { resolution: [720, 360] }
  }),
  mimas: textureSet({
    id: "mimas",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Mimas Voyager mosaic",
    sourceUrl: `${jplTextureMaps}saturn.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用清理后的 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  enceladus: textureSet({
    id: "enceladus",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Enceladus Voyager mosaic",
    sourceUrl: `${jplTextureMaps}saturn.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用清理后的 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  tethys: textureSet({
    id: "tethys",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Tethys Voyager mosaic",
    sourceUrl: `${jplTextureMaps}saturn.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用清理后的 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  dione: textureSet({
    id: "dione",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Dione Voyager mosaic",
    sourceUrl: `${jplTextureMaps}saturn.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用清理后的 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  rhea: textureSet({
    id: "rhea",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Rhea Voyager mosaic",
    sourceUrl: `${jplTextureMaps}saturn.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用清理后的 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  titan: textureSet({
    id: "titan",
    accuracyKind: "representative",
    sourceTitle: "JPL Solar System Simulator Titan representative texture",
    sourceUrl: `${jplTextureMaps}saturn.html`,
    credit: "David Seal/JPL/Caltech",
    dataTypeZh: "代表性厚大气贴图",
    noteZh: "JPL 页面标注为 Titan 概念/代表性贴图；主视觉仍以厚雾大气壳表现。",
    nativeResolution: [720, 360],
    variants: { resolution: [720, 360] }
  }),
  iapetus: textureSet({
    id: "iapetus",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Iapetus Voyager mosaic",
    sourceUrl: `${jplTextureMaps}saturn.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用清理后的 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  uranus: textureSet({
    id: "uranus",
    accuracyKind: "representative",
    sourceTitle: "JPL Solar System Simulator Uranus representative color texture",
    sourceUrl: `${jplTextureMaps}uranus.html`,
    credit: "JPL/Caltech",
    dataTypeZh: "代表性冰巨星贴图",
    noteZh: "JPL 页面标注为纯色/代表性外观；不做地形位移。",
    nativeResolution: [720, 360],
    variants: { resolution: [720, 360] }
  }),
  miranda: textureSet({
    id: "miranda",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Miranda Voyager mosaic",
    sourceUrl: `${jplTextureMaps}uranus.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  ariel: textureSet({
    id: "ariel",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Ariel Voyager mosaic",
    sourceUrl: `${jplTextureMaps}uranus.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  umbriel: textureSet({
    id: "umbriel",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Umbriel Voyager mosaic",
    sourceUrl: `${jplTextureMaps}uranus.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  titania: textureSet({
    id: "titania",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Titania Voyager mosaic",
    sourceUrl: `${jplTextureMaps}uranus.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  oberon: textureSet({
    id: "oberon",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Oberon Voyager mosaic",
    sourceUrl: `${jplTextureMaps}uranus.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用 Voyager 拼图；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  }),
  neptune: textureSet({
    id: "neptune",
    accuracyKind: "representative",
    sourceTitle: "JPL Solar System Simulator Neptune representative cloud texture",
    sourceUrl: `${jplTextureMaps}neptune.html`,
    credit: "Don Davis/JPL/Caltech",
    dataTypeZh: "代表性冰巨星贴图",
    noteZh: "JPL 页面标注为 fictional cloud texture；不做地形位移。",
    nativeResolution: [720, 360],
    variants: { resolution: [720, 360] }
  }),
  triton: textureSet({
    id: "triton",
    accuracyKind: "measured",
    sourceTitle: "JPL Solar System Simulator Triton Voyager mosaic",
    sourceUrl: `${jplTextureMaps}neptune.html`,
    credit: "NASA/JPL/Caltech/USGS",
    dataTypeZh: "真实航天器影像拼图",
    noteZh: "使用有限 Voyager 影像拼接；没有启用全球测量高度位移。",
    nativeResolution: [1440, 720],
    variants: { resolution: [1440, 720] }
  })
};

export function getSurfaceTextureSet(textureSetId?: string) {
  if (!textureSetId) {
    return undefined;
  }

  return surfaceTextureSets[textureSetId];
}
