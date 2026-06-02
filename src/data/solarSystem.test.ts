import { describe, expect, it } from "vitest";
import {
  bodies,
  bodiesById,
  knownPlanetarySatelliteCounts,
  representedSatelliteCount,
  smallBodyPopulations
} from "./solarSystem";

describe("solar system catalog", () => {
  it("contains the sun and all eight planets", () => {
    const required = [
      "sun",
      "mercury",
      "venus",
      "earth",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune"
    ];
    for (const id of required) {
      expect(bodiesById[id]).toBeDefined();
    }
  });

  it("gives every orbiting body a parent and orbit", () => {
    for (const body of bodies) {
      if (body.id === "sun") {
        continue;
      }
      expect(body.parentId).toBeTruthy();
      expect(bodiesById[body.parentId!]).toBeDefined();
      expect(body.orbit).toBeDefined();
    }
  });

  it("represents the configured full satellite counts", () => {
    for (const [planetId, expectedCount] of Object.entries(
      knownPlanetarySatelliteCounts
    )) {
      expect(representedSatelliteCount(planetId)).toBe(expectedCount);
    }
  });

  it("includes the requested distant structures", () => {
    expect(smallBodyPopulations.map((population) => population.id)).toEqual(
      expect.arrayContaining(["kuiper-belt", "scattered-disc", "oort-cloud"])
    );
  });

  it("models major heliocentric orbit planes with node directions", () => {
    const heliocentricBodies = bodies.filter(
      (body) => body.parentId === "sun" && body.orbit?.semiMajorAxisAU != null
    );

    for (const body of heliocentricBodies) {
      expect(body.orbit?.inclinationDeg).toBeDefined();
      expect(body.orbit?.longitudeOfAscendingNodeDeg).toBeDefined();
      expect(body.orbit?.argumentOfPeriapsisDeg).toBeDefined();
    }
  });
});
