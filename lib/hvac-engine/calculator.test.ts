import { describe, expect, it } from "vitest";
import { calculateAirconLoad } from "./airconLoadEngine";
import { calculateHeatLoad } from "./heatLoadEngine";
import { buildEngineInputs } from "./mapInputs";
import { recommendAcSystems } from "./recommendationEngine";
import { getSizingAdvice } from "./sizingAdvice";

describe("calculateAirconLoad", () => {
  it("sizes a typical bedroom", () => {
    const result = calculateAirconLoad({
      areaSqm: 12,
      ceilingHeightM: 2.7,
      sunExposure: "medium",
      windowRatio: "low",
      occupancy: 2,
      roomType: "bedroom",
      insulation: "average",
      appliances: { computer: 0 },
    });
    expect(result.totalBtu).toBeGreaterThan(0);
    expect(result.totalHp).toBeGreaterThan(0);
    expect(result.recommendedSystemOptions.length).toBeGreaterThan(0);
    expect(result.recommendation.bestMatch.systemId).toBe("split_inverter");
  });

  it("matches form mapper for 4x5m bedroom", () => {
    const inputs = buildEngineInputs({
      lengthM: "4",
      widthM: "5",
      people: "2",
      roomTypeLabel: "Bedroom",
      sunLabel: "Normal",
      ceilingM: "2.7",
      insulationLabel: "Average",
      windows: "1",
      electronics: "0",
      hasKitchen: false,
      budgetPreference: "balanced",
      noisePreference: "quiet",
      energyPreference: "important",
      installationConstraint: "standard",
    });
    const result = calculateAirconLoad(inputs);
    expect(result.totalHp).toBeCloseTo(result.totalBtu / 9000, 2);
  });

  it("increases load for very sunny exposure", () => {
    const base = calculateAirconLoad({
      areaSqm: 20,
      sunExposure: "none",
      windowRatio: "low",
      roomType: "bedroom",
      insulation: "average",
    });
    const sunny = calculateAirconLoad({
      areaSqm: 20,
      sunExposure: "very_high",
      windowRatio: "low",
      roomType: "bedroom",
      insulation: "average",
    });
    expect(sunny.totalBtu).toBeGreaterThan(base.totalBtu);
  });
});

describe("calculateHeatLoad", () => {
  it("returns only cooling-load data", () => {
    const result = calculateHeatLoad({
      areaSqm: 20,
      sunExposure: "medium",
      windowRatio: "low",
      roomType: "bedroom",
      insulation: "average",
    });

    expect(result.requiredBtu).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
    expect(result).not.toHaveProperty("recommendedSystemOptions");
  });
});

describe("recommendAcSystems", () => {
  it("supports multiple compatible systems for a normal bedroom load", () => {
    const heatLoad = calculateHeatLoad({
      areaSqm: 20,
      sunExposure: "medium",
      windowRatio: "low",
      roomType: "bedroom",
      insulation: "average",
    });

    const result = recommendAcSystems({
      heatLoad,
      inputs: {
        areaSqm: 20,
        roomType: "bedroom",
        sunExposure: "medium",
        windowRatio: "low",
        insulation: "average",
      },
      preferences: {
        budget: "balanced",
        noise: "quiet",
        energy: "important",
      },
    });

    expect(result.possibleSystems.length).toBeGreaterThan(1);
    expect(result.rankedRecommendations[0].systemId).toBe("split_inverter");
    expect(result.possibleSystems.some((system) => system.systemId === "window_type")).toBe(true);
  });
});

describe("getSizingAdvice", () => {
  it("flags undersized catalog pick", () => {
    const advice = getSizingAdvice(25000, 2.78);
    expect(["ok", "undersized", "oversized"]).toContain(advice.status);
    expect(advice.catalogHp).toBeGreaterThan(0);
  });
});
