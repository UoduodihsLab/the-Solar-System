import { describe, expect, it } from "vitest";
import {
  advanceSimulationDays,
  formatSimulationDate,
  formatSpeed
} from "./time";

describe("simulation time", () => {
  it("advances only while playing", () => {
    expect(advanceSimulationDays(10, 2, true, 30)).toBe(70);
    expect(advanceSimulationDays(10, 2, false, 30)).toBe(10);
  });

  it("formats the fixed simulation epoch", () => {
    expect(formatSimulationDate(0)).toContain("2026");
  });

  it("formats fast time scales as years", () => {
    expect(formatSpeed(730)).toBe("2.0 年/秒");
  });
});
