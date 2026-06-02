# 项目说明

这个项目名为 The Solar System，使用 Vite + React + TypeScript 构建一个网页端可游览的太阳系 3D 模型。当前代码实现的是第一阶段：自然太阳系的高性能 3D 场景。

目标不是普通科普图式的太阳系，而是一个可缩放、可聚焦、可在网页端以上帝视角游览的空间模型。行星与卫星具有自转和公转；太阳系整体也以视觉化方式表现围绕银河中心方向的运动。

## 当前代码事实

- 技术栈：Vite、React 19、TypeScript、Three.js、@react-three/fiber、@react-three/drei、@react-three/postprocessing、lucide-react、Vitest。
- 入口：`src/main.tsx` 挂载 React 应用，`src/App.tsx` 组合 3D 场景与 HUD。
- 主场景：`src/components/SolarSystemScene.tsx` 创建 R3F `Canvas`、灯光、后期 Bloom/Vignette、相机控制、星空环境、小天体点云和太阳系根节点。
- 太阳系根节点：`SolarSystemRoot` 会随模拟时间产生整体位移与旋转，用来表现太阳系相对银河中心方向的运动。
- 相机：`src/components/CameraRig.tsx` 使用 drei `CameraControls`，支持聚焦目标、缩放、拖拽游览、WASD/方向键移动、Q/E 垂直移动、Shift 加速。
- HUD：`src/components/Hud.tsx` 支持播放/暂停、重置时间、时间轴、速度选择、目标选择、聚焦、标签显示开关、轨道线显示开关和目标信息面板。
- 天体数据：`src/data/solarSystem.ts` 是核心数据源，包含太阳、八大行星、主要卫星、矮行星、小天体族群，以及未来场景层占位的 `futureExternalLayers`。
- 卫星表现：主要卫星以显式天体建模；木星、土星、天王星、海王星等还通过不规则卫星点云补足已知卫星数量。测试要求 `representedSatelliteCount` 与 `knownPlanetarySatelliteCounts` 一致。
- 轨道计算：`src/lib/orbits.ts` 支持开普勒近似、偏心率、轨道倾角、升交点、近拱点幅角、相位和逆行。
- 比例尺：`src/lib/scale.ts` 对内太阳系使用线性 AU 映射，对远日结构使用对数压缩；半径是视觉可读的非线性缩放，不是严格真实比例。
- 时间系统：`src/lib/time.ts` 以 2026-06-02 UTC 为模拟纪元，`daysPerSecond` 控制模拟推进。
- 视觉系统：`src/components/ProceduralMaterials.tsx` 使用 shader 程序化表现太阳、岩质行星、气态/冰巨星、冰质/岩质小天体等表面；太阳包含噪声流动、耀斑感、日冕与日珥。
- 环与云：`RingSystem` 表现行星环，`OrbitLine` 表现轨道线，`SmallBodyCloud` 表现小行星带、木星特洛伊群、柯伊伯带、离散盘、彗星轨道流、奥尔特星云。
- 样式：`src/styles.css` 是全局样式，当前 UI 是深色玻璃质感 HUD，画布全屏铺底。
- 测试：当前有 4 个 Vitest 测试文件，覆盖太阳系目录、轨道、比例尺和时间函数。

## 开发原则

- 优先保持数据驱动：新增自然天体、卫星、小天体族群时，先扩展 `src/data/solarSystem.ts` 和 `src/types.ts`，再让现有组件消费数据。
- 不要把自然天体、未来人造结构和 UI 状态混在同一层抽象里。未来扩展层应作为独立外部层或独立配置接入，并注册可选择/可聚焦目标。
- 新增绕日天体时，应尽量提供 `semiMajorAxisAU`、`periodDays`、`eccentricity`、`inclinationDeg`、`longitudeOfAscendingNodeDeg`、`argumentOfPeriapsisDeg`、`phaseDeg`，保持与现有轨道模型一致。
- 新增卫星时使用 `semiMajorAxisKm` 和父天体半径换算，不要手写场景距离。
- 不要直接用真实半径或真实 AU 距离塞进 Three.js 坐标；必须经过 `scale.ts` 的映射函数，除非是刻意新增并测试过的比例系统。
- 太阳本身需要继续保持自转表现。当前太阳数据已有 `rotation`，材质层也用动态 shader、日冕和日珥表现太阳活动。
- 视觉优先使用程序化材质、点云、shader 和几何结构。若引入贴图或外部资产，需要确认加载路径、性能和构建结果。
- R3F 动画逻辑应放在 `useFrame`；大量几何、点云、采样点应使用 `useMemo` 缓存，避免每帧重建。
- 保持 HUD 是辅助控制层，不要让说明性大段文字遮挡 3D 视野。
- 前端视觉改动后，应在浏览器里实际检查缩放、聚焦、标签、轨道线、移动控制和移动端布局。

## 后续方向

后续工作应继续围绕太阳系模拟本身展开：

- 提升天体表面、环系统、卫星群和小天体结构的视觉可信度。
- 改进比例尺、导航体验、目标聚焦和远日结构的可读性。
- 在不破坏自然天体模型的前提下，加入清晰分层的未来场景扩展。

实现时应优先复用现有目标注册、选择、聚焦、时间推进和缩放体系。新增结构需要有清晰的空间层级、视觉尺度、交互目标和说明面板，不应破坏第一阶段自然天体模型。

## 常用命令

- 安装依赖：`npm install`
- 本地开发：`npm run dev`
- 测试：`npm test`
- 生产构建：`npm run build`
- 预览构建：`npm run preview`

当前代码已验证：

- `npm test` 通过：4 个测试文件，16 条测试。
- `npm run build` 通过；Vite 会提示主 JS chunk 超过 500 kB，这是当前 3D 依赖体积导致的已知提示，不代表构建失败。
