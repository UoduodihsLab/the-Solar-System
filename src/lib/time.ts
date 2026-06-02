export const SIMULATION_EPOCH_UTC = Date.UTC(2026, 5, 2, 0, 0, 0);

export function advanceSimulationDays(
  currentDays: number,
  deltaSeconds: number,
  playing: boolean,
  daysPerSecond: number
) {
  if (!playing) {
    return currentDays;
  }

  return currentDays + deltaSeconds * daysPerSecond;
}

export function formatSimulationDate(elapsedDays: number) {
  const date = new Date(SIMULATION_EPOCH_UTC + elapsedDays * 86_400_000);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function formatSpeed(daysPerSecond: number) {
  if (daysPerSecond < 1) {
    return `${(daysPerSecond * 24).toFixed(1)} 小时/秒`;
  }

  if (daysPerSecond < 365) {
    return `${daysPerSecond.toFixed(0)} 天/秒`;
  }

  return `${(daysPerSecond / 365).toFixed(1)} 年/秒`;
}
