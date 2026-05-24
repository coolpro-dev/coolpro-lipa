import { hvacConfig } from "./config";
import { calculateHeatLoad, validateHeatLoadInputs } from "./heatLoadEngine";
import { recommendAcSystems } from "./recommendationEngine";
import type {
  AirconLoadInputs,
  AirconLoadResult,
  InstallationConstraints,
  RecommendationPreferences,
  RoomType,
} from "./types";

const COMMERCIAL_ROOM_TYPES = new Set<RoomType>([
  "commercial_hall",
  "restaurant",
  "server_room",
  "gym",
  "classroom",
  "retail_store",
]);

function round(value: number, precision = 2): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function classifyProject(totalTR: number, roomType: RoomType) {
  if (totalTR <= 2) {
    return {
      scaleCategory: "small_residential",
      scaleLabel: "Small Residential",
      estimatedTR: round(totalTR),
      applicationType: COMMERCIAL_ROOM_TYPES.has(roomType) ? "commercial" : "residential",
    };
  }
  if (totalTR <= 5) {
    return {
      scaleCategory: "large_residential",
      scaleLabel: "Large Residential",
      estimatedTR: round(totalTR),
      applicationType: COMMERCIAL_ROOM_TYPES.has(roomType) ? "commercial" : "residential",
    };
  }
  if (totalTR <= 12) {
    return {
      scaleCategory: "light_commercial",
      scaleLabel: "Light Commercial",
      estimatedTR: round(totalTR),
      applicationType: "commercial",
    };
  }
  return {
    scaleCategory: "engineered_project",
    scaleLabel: "Engineered HVAC Project",
    estimatedTR: round(totalTR),
    applicationType: "commercial",
  };
}

function buildWarnings(result: AirconLoadResult): string[] {
  return [
    ...result.validationWarnings,
    ...(result.recommendation.oversizeWarning ? [result.recommendation.oversizeWarning] : []),
    ...(result.recommendation.undersizeWarning ? [result.recommendation.undersizeWarning] : []),
  ];
}

export function calculateAirconLoad(
  rawInputs: AirconLoadInputs,
  options?: {
    preferences?: Partial<RecommendationPreferences>;
    installationConstraints?: InstallationConstraints;
  },
): AirconLoadResult {
  const { validated, warnings: validationWarnings } = validateHeatLoadInputs(rawInputs);
  const heatLoad = calculateHeatLoad(validated);
  const roomType = validated.roomType;
  const totalBtu = heatLoad.requiredBtu;
  const totalHp = round(totalBtu / hvacConfig.heatLoad.btuPerHp);
  const totalTR = round(totalBtu / hvacConfig.heatLoad.btuPerTon);
  const recommendation = recommendAcSystems({
    heatLoad,
    inputs: validated,
    preferences: options?.preferences,
    installationConstraints: options?.installationConstraints,
  });

  const result: AirconLoadResult = {
    totalBtu,
    totalHp,
    totalTR,
    totalTons: totalTR,
    breakdown: heatLoad.adjustmentBreakdown,
    heatLoad,
    recommendation,
    projectClassification: classifyProject(totalTR, roomType),
    recommendedSystemOptions: recommendation.rankedRecommendations.map((system) => ({
      systemType: system.systemId,
      systemLabel: system.systemLabel,
      recommendedUseCase: system.rankReasons[0],
      hp: system.hp,
      score: system.score,
    })),
    contractorNotes: [
      "Cooling load is a preliminary estimate; final equipment selection still needs an on-site survey.",
      "Electrical service, breaker size, condenser placement, drain routing, and wall/ceiling conditions must be confirmed before installation.",
      ...heatLoad.adjustmentBreakdown.adjustments
        .filter((adjustment) => Math.abs(adjustment.effectBtu) >= 500)
        .map((adjustment) => adjustment.explanation),
    ],
    warnings: [],
    validationWarnings,
  };

  result.warnings = buildWarnings(result);
  return result;
}
