# The Solar System

[English version](README.md)

一个使用 Vite、React、TypeScript 和 Three.js 构建的高性能网页端 3D 太阳系模拟项目。

这个项目将太阳系表现为一个可游览的空间模型，而不是平面科普图式。行星与卫星会自转和公转，远日小天体结构通过视觉尺度压缩保持可见和可导航，整个场景可以从宽广的上帝视角自由探索。

## 功能特性

- 基于 React Three Fiber 的全屏 3D 场景。
- 太阳、八大行星、主要卫星、矮行星、行星环、不规则卫星点云和小天体族群。
- 行星自转与轨道运动，支持偏心率、轨道倾角、升交点方向、近拱点幅角、相位，以及配置过的逆行运动。
- 用于太阳、岩质行星、气态巨行星、冰巨行星、卫星和矮天体的程序化 shader 材质。
- 太阳活动视觉效果，包括动态表面流动、日冕、日珥、Bloom 和自发光照明。
- 小天体结构，包括小行星带、木星特洛伊群、柯伊伯带、离散盘、彗星轨道流和奥尔特星云。
- 相机控制支持缩放、环绕、拖拽游览、目标聚焦、WASD/方向键移动、Q/E 垂直移动和 Shift 加速。
- HUD 控制支持播放、模拟速度、时间轴重置/拖动、目标选择、聚焦、标签、轨道线和选中目标元数据。

## 技术栈

- Vite
- React 19
- TypeScript
- Three.js
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing
- lucide-react
- Vitest

## 快速开始

安装依赖：

```bash
npm install
```

启动本地开发服务器：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

运行测试：

```bash
npm test
```

预览生产构建：

```bash
npm run preview
```

## 项目结构

- `src/main.tsx` 挂载 React 应用。
- `src/App.tsx` 组合 3D 场景和 HUD 状态。
- `src/components/SolarSystemScene.tsx` 创建画布、灯光、后期处理、相机控制、太空环境和太阳系根节点。
- `src/components/CelestialBodyNode.tsx` 递归渲染天体，包括自转、轨道位置、标签、环、气氛、选中光晕和子天体。
- `src/components/ProceduralMaterials.tsx` 包含基于 shader 的天体表面和太阳视觉效果。
- `src/components/Hud.tsx` 提供模拟控制和选中目标信息。
- `src/components/CameraRig.tsx` 处理相机聚焦和自由导航。
- `src/data/solarSystem.ts` 是天体、卫星、小天体族群、卫星数量和未来场景层 ID 的核心目录。
- `src/lib/orbits.ts` 实现轨道数学。
- `src/lib/scale.ts` 将真实天文距离和半径映射到可读的场景单位。
- `src/lib/time.ts` 处理模拟时间和格式化。

## 模拟模型

场景使用视觉尺度，而不是严格真实世界比例。内太阳系距离按 AU 线性映射，远日结构使用对数压缩，因此柯伊伯带、离散盘和奥尔特星云仍然可见且可导航。天体半径也使用非线性缩放，让小型卫星和矮行星保持可读。

模拟纪元固定为 `2026-06-02 UTC`。时间会根据 HUD 中选择的 `daysPerSecond` 值推进。

## 当前范围

当前实现聚焦于自然太阳系：

- 太阳和八大行星
- 行星自转与公转
- 主要卫星和已表现的卫星族群
- 行星环
- 矮行星和远日小天体结构
- 太阳系相对银河中心方向运动的视觉表现

后续工作应在保留现有选择、聚焦、时间和比例系统的基础上，继续提升天文细节、渲染可信度和导航性能。

## 验证

当前项目状态已通过以下命令验证：

```bash
npm test
npm run build
```

`npm run build` 可能会显示 Vite 默认的主 JavaScript chunk 超过 500 kB 提示。对于当前 3D 依赖体积来说，这是预期提示，不代表构建失败。
