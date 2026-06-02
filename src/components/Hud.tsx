import {
  BadgeInfo,
  Eye,
  EyeOff,
  Focus,
  Orbit,
  Pause,
  Play,
  RotateCcw,
  Search
} from "lucide-react";
import type { CelestialBodyConfig, SmallBodyPopulationConfig } from "../types";
import {
  bodiesById,
  knownPlanetarySatelliteCounts,
  representedSatelliteCount,
  selectionTargets,
  smallBodyPopulations
} from "../data/solarSystem";
import { formatDistanceAU, radiusKmToSceneUnits } from "../lib/scale";
import { formatSimulationDate, formatSpeed } from "../lib/time";

const speedOptions = [0.25, 1, 7, 30, 365, 3650];

export function Hud({
  selectedId,
  elapsedDays,
  playing,
  daysPerSecond,
  labelsVisible,
  orbitsVisible,
  onSelect,
  onFocus,
  onPlayingChange,
  onSpeedChange,
  onElapsedDaysChange,
  onLabelsVisibleChange,
  onOrbitsVisibleChange
}: {
  selectedId: string;
  elapsedDays: number;
  playing: boolean;
  daysPerSecond: number;
  labelsVisible: boolean;
  orbitsVisible: boolean;
  onSelect: (id: string) => void;
  onFocus: (id: string) => void;
  onPlayingChange: (playing: boolean) => void;
  onSpeedChange: (daysPerSecond: number) => void;
  onElapsedDaysChange: (days: number) => void;
  onLabelsVisibleChange: (visible: boolean) => void;
  onOrbitsVisibleChange: (visible: boolean) => void;
}) {
  const selectedBody = bodiesById[selectedId];
  const selectedPopulation = smallBodyPopulations.find(
    (population) => population.id === selectedId
  );

  return (
    <div className="hud">
      <header className="hud-header">
        <div>
          <p className="eyebrow">三体太阳系模型 / 第一阶段</p>
          <h1>太阳系上帝视角</h1>
        </div>
        <div className="date-pill">{formatSimulationDate(elapsedDays)}</div>
      </header>

      <section className="toolbar" aria-label="时间控制">
        <button
          className="icon-button primary"
          onClick={() => onPlayingChange(!playing)}
          title={playing ? "暂停" : "播放"}
          aria-label={playing ? "暂停" : "播放"}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          className="icon-button"
          onClick={() => onElapsedDaysChange(0)}
          title="重置时间"
          aria-label="重置时间"
        >
          <RotateCcw size={18} />
        </button>
        <label className="timeline">
          <input
            type="range"
            min={-365}
            max={36500}
            step={1}
            value={Math.max(-365, Math.min(36500, elapsedDays))}
            onChange={(event) => onElapsedDaysChange(Number(event.target.value))}
          />
        </label>
        <select
          className="select compact"
          value={daysPerSecond}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          aria-label="模拟速度"
        >
          {speedOptions.map((speed) => (
            <option key={speed} value={speed}>
              {formatSpeed(speed)}
            </option>
          ))}
        </select>
      </section>

      <section className="toolbar secondary" aria-label="显示控制">
        <label className="search-box">
          <Search size={16} />
          <select
            value={selectedId}
            onChange={(event) => {
              onSelect(event.target.value);
              onFocus(event.target.value);
            }}
            aria-label="选择天体"
          >
            {selectionTargets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.label}
              </option>
            ))}
          </select>
        </label>
        <button
          className="icon-text-button"
          onClick={() => onFocus(selectedId)}
          title="聚焦"
        >
          <Focus size={16} />
          聚焦
        </button>
        <button
          className={`icon-button ${labelsVisible ? "is-on" : ""}`}
          onClick={() => onLabelsVisibleChange(!labelsVisible)}
          title="标签"
          aria-label="标签"
        >
          {labelsVisible ? <Eye size={17} /> : <EyeOff size={17} />}
        </button>
        <button
          className={`icon-button ${orbitsVisible ? "is-on" : ""}`}
          onClick={() => onOrbitsVisibleChange(!orbitsVisible)}
          title="轨道线"
          aria-label="轨道线"
        >
          <Orbit size={17} />
        </button>
      </section>

      <SelectionPanel
        body={selectedBody}
        population={selectedPopulation}
        onFocus={() => onFocus(selectedId)}
      />
    </div>
  );
}

function SelectionPanel({
  body,
  population,
  onFocus
}: {
  body?: CelestialBodyConfig;
  population?: SmallBodyPopulationConfig;
  onFocus: () => void;
}) {
  if (population) {
    return (
      <aside className="info-panel">
        <div className="panel-title">
          <BadgeInfo size={17} />
          <span>{population.nameZh}</span>
        </div>
        <p>{population.descriptionZh}</p>
        <dl>
          <div>
            <dt>实例数量</dt>
            <dd>{population.count.toLocaleString("zh-CN")}</dd>
          </div>
          <div>
            <dt>范围</dt>
            <dd>
              {population.minAU.toLocaleString("zh-CN")}-
              {population.maxAU.toLocaleString("zh-CN")} AU
            </dd>
          </div>
          <div>
            <dt>渲染方式</dt>
            <dd>压缩点云</dd>
          </div>
        </dl>
        <button className="panel-action" onClick={onFocus}>
          <Focus size={16} />
          聚焦
        </button>
      </aside>
    );
  }

  if (!body) {
    return null;
  }

  const satelliteCount = knownPlanetarySatelliteCounts[body.id];
  const visualRadius = radiusKmToSceneUnits(body.radiusKm, body.kind);
  const rotation = body.rotation
    ? `${Math.abs(body.rotation.periodHours).toLocaleString("zh-CN", {
        maximumFractionDigits: 1
      })} 小时${body.rotation.retrograde ? " / 逆向" : ""}`
    : "未设置";

  return (
    <aside className="info-panel">
      <div className="panel-title">
        <BadgeInfo size={17} />
        <span>
          {body.nameZh} / {body.nameEn}
        </span>
      </div>
      <p>{body.descriptionZh}</p>
      <dl>
        <div>
          <dt>类型</dt>
          <dd>{kindLabel(body.kind)}</dd>
        </div>
        <div>
          <dt>真实半径</dt>
          <dd>{Math.round(body.radiusKm).toLocaleString("zh-CN")} km</dd>
        </div>
        <div>
          <dt>视觉半径</dt>
          <dd>{visualRadius.toFixed(2)} scene</dd>
        </div>
        <div>
          <dt>轨道距离</dt>
          <dd>{formatDistanceAU(body.meanDistanceAU)}</dd>
        </div>
        {body.orbit?.inclinationDeg != null ? (
          <div>
            <dt>轨道倾角</dt>
            <dd>{body.orbit.inclinationDeg.toFixed(2)}°</dd>
          </div>
        ) : null}
        {body.orbit?.longitudeOfAscendingNodeDeg != null ? (
          <div>
            <dt>升交点</dt>
            <dd>{body.orbit.longitudeOfAscendingNodeDeg.toFixed(1)}°</dd>
          </div>
        ) : null}
        <div>
          <dt>自转周期</dt>
          <dd>{rotation}</dd>
        </div>
        {satelliteCount != null ? (
          <div>
            <dt>卫星呈现</dt>
            <dd>
              {representedSatelliteCount(body.id)} / {satelliteCount}
            </dd>
          </div>
        ) : null}
      </dl>
      <button className="panel-action" onClick={onFocus}>
        <Focus size={16} />
        聚焦
      </button>
    </aside>
  );
}

function kindLabel(kind: CelestialBodyConfig["kind"]) {
  switch (kind) {
    case "star":
      return "恒星";
    case "planet":
      return "行星";
    case "moon":
      return "卫星";
    case "dwarf":
      return "矮行星";
    default:
      return kind;
  }
}
