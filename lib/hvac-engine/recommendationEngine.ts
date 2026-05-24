import { hvacConfig } from "./config";
import type {
  AcSystemRecommendation,
  AirconLoadInputs,
  HeatLoadResult,
  InstallationConstraints,
  RecommendationPreferences,
  RecommendationResult,
  RecommendationSystemId,
  RoomType,
} from "./types";

const DEFAULT_PREFERENCES: RecommendationPreferences = {
  budget: "balanced",
  noise: "standard",
  energy: "standard",
};

const DEFAULT_CONSTRAINTS: Required<InstallationConstraints> = {
  hasWindowOpening: true,
  hasOutdoorSpace: true,
  hasCeilingSpace: false,
};

function round(value: number, precision = 0): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function pickHp(requiredBtu: number, hpCatalog: readonly number[]): number {
  for (const hp of hpCatalog) {
    if (hp * hvacConfig.heatLoad.btuPerHp >= requiredBtu * 0.95) return hp;
  }
  return hpCatalog[hpCatalog.length - 1];
}

function sizingStatus(capacityBtu: number, requiredBtu: number): AcSystemRecommendation["sizingStatus"] {
  const ratio = capacityBtu / requiredBtu;
  if (ratio < 0.95) return "undersized";
  if (ratio > 1.3) return "oversized";
  return "ok";
}

function getCooldownPerformance(capacityBtu: number, requiredBtu: number, factor: number): string {
  const ratio = capacityBtu / requiredBtu;
  if (ratio < 0.95) return "Slow cooldown; likely to struggle during peak afternoon heat.";
  if (ratio > 1.35) return "Fast initial cooldown, but may cycle more often if non-inverter.";
  if (factor < 0.95) return "Steady cooldown with good temperature control.";
  return "Normal cooldown for the calculated room load.";
}

function estimateMonthlyKwh(capacityBtu: number, wattsPerBtu: number, roomType: RoomType): number {
  const dailyHours = roomType === "bedroom" ? 8 : roomType === "office" ? 9 : 6;
  const diversity = roomType === "server_room" ? 1 : 0.62;
  return round((capacityBtu * wattsPerBtu * dailyHours * 30 * diversity) / 1000);
}

function compatibilityScore(capacityBtu: number, requiredBtu: number): number {
  const ratio = capacityBtu / requiredBtu;
  if (ratio >= 0.98 && ratio <= 1.2) return hvacConfig.recommendationWeights.sizingFit;
  if (ratio >= 0.95 && ratio <= 1.3) return hvacConfig.recommendationWeights.sizingFit * 0.75;
  if (ratio < 0.95) return hvacConfig.recommendationWeights.sizingFit * 0.25;
  return hvacConfig.recommendationWeights.sizingFit * 0.45;
}

function roomProfileScore(systemId: RecommendationSystemId, roomType: RoomType): {
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  if (roomType === "bedroom") {
    if (systemId === "split_inverter") {
      score += 12;
      reasons.push("bedrooms benefit from quiet inverter operation at night");
    } else if (systemId === "standard_split") {
      score += 8;
      reasons.push("split systems keep bedroom indoor noise lower than window units");
    }
  }

  if (roomType === "office" || roomType === "server_room") {
    if (systemId === "split_inverter" || systemId === "multi_split") {
      score += 12;
      reasons.push("long operating hours favor inverter efficiency");
    }
  }

  if (
    roomType === "commercial_hall" ||
    roomType === "restaurant" ||
    roomType === "classroom" ||
    roomType === "retail_store"
  ) {
    if (systemId === "ceiling_cassette") {
      score += 12;
      reasons.push("open rooms need better air distribution than a single wall or window unit");
    } else if (systemId === "packaged_unit") {
      score += 10;
      reasons.push("larger open spaces benefit from ducted distribution and centralized return air");
    }
  }

  return { score, reasons };
}

function constraintPenalty(
  systemId: RecommendationSystemId,
  constraints: Required<InstallationConstraints>,
): { penalty: number; cautions: string[] } {
  const cautions: string[] = [];
  let penalty = 0;

  if (systemId === "window_type" && !constraints.hasWindowOpening) {
    penalty += hvacConfig.recommendationWeights.constraints;
    cautions.push("requires a window opening or wall sleeve");
  }
  if (systemId !== "window_type" && !constraints.hasOutdoorSpace) {
    penalty += hvacConfig.recommendationWeights.constraints;
    cautions.push("requires outdoor condenser space");
  }
  if (systemId === "ceiling_cassette" && !constraints.hasCeilingSpace) {
    penalty += 10;
    cautions.push("requires ceiling space for cassette installation");
  }
  if (systemId === "packaged_unit" && !constraints.hasCeilingSpace) {
    penalty += 8;
    cautions.push("usually requires ceiling or duct route space");
  }

  return { penalty, cautions };
}

export function recommendAcSystems({
  heatLoad,
  inputs,
  preferences = DEFAULT_PREFERENCES,
  installationConstraints = DEFAULT_CONSTRAINTS,
}: {
  heatLoad: HeatLoadResult;
  inputs: AirconLoadInputs;
  preferences?: Partial<RecommendationPreferences>;
  installationConstraints?: InstallationConstraints;
}): RecommendationResult {
  const roomType = inputs.roomType ?? hvacConfig.heatLoad.defaults.roomType;
  const mergedPreferences = { ...DEFAULT_PREFERENCES, ...preferences };
  const constraints = { ...DEFAULT_CONSTRAINTS, ...installationConstraints };
  const requiredBtu = heatLoad.requiredBtu;
  const trace: string[] = [];

  const possibleSystems = hvacConfig.systemCatalog
    .filter((system) => {
      const byBtu =
        requiredBtu >= system.compatibleBtuMin * 0.9 &&
        requiredBtu <= system.compatibleBtuMax * 1.1;
      const byArea =
        (!("minAreaSqm" in system) || !system.minAreaSqm || inputs.areaSqm >= system.minAreaSqm) &&
        (!("maxAreaSqm" in system) || !system.maxAreaSqm || inputs.areaSqm <= system.maxAreaSqm);
      return byBtu && byArea;
    })
    .map<AcSystemRecommendation & { rankingScore: number }>((system) => {
      const hp = pickHp(requiredBtu, system.hpCatalog);
      const capacityBtu = hp * hvacConfig.heatLoad.btuPerHp;
      const status = sizingStatus(capacityBtu, requiredBtu);
      const preferenceWeights = hvacConfig.recommendationWeights.budget[mergedPreferences.budget];
      const roomScore = roomProfileScore(system.id, roomType);
      const constraintsResult = constraintPenalty(system.id, constraints);
      const rankReasons = [system.explanation, ...roomScore.reasons];

      let score =
        hvacConfig.recommendationWeights.baseCompatibility +
        compatibilityScore(capacityBtu, requiredBtu) +
        roomScore.score +
        system.upfrontCost * preferenceWeights.upfrontCost +
        system.efficiency * preferenceWeights.efficiency +
        system.quietness * preferenceWeights.quietness -
        constraintsResult.penalty;

      if (mergedPreferences.noise === "quiet") {
        score += system.quietness * hvacConfig.recommendationWeights.noise.quiet;
        rankReasons.push("quiet operation was prioritized");
      }
      if (mergedPreferences.energy === "important") {
        score += system.efficiency * hvacConfig.recommendationWeights.energy.important;
        rankReasons.push("energy saving was prioritized");
      }
      if (status === "undersized") {
        score -= 25;
        rankReasons.push("capacity is below the calculated peak load");
      }
      if (status === "oversized") {
        score -= system.id === "split_inverter" ? 5 : 14;
        rankReasons.push("capacity is above the calculated load; inverter control reduces this risk");
      }

      const hpLabel = hp.toLocaleString("en-US", {
        minimumFractionDigits: hp % 1 === 0 ? 1 : 0,
        maximumFractionDigits: 2,
      });
      const recommendation = {
        systemId: system.id,
        systemLabel: `${hpLabel} HP ${system.label}`,
        capacityLabel: `${hp} HP / ${capacityBtu.toLocaleString()} BTU/hr`,
        hp,
        capacityBtu,
        score: round(clamp(score, 0, 100)),
        rankingScore: score,
        rankReasons,
        cautions: constraintsResult.cautions,
        estimatedMonthlyKwh: estimateMonthlyKwh(capacityBtu, system.estimatedWattsPerBtu, roomType),
        cooldownPerformance: getCooldownPerformance(capacityBtu, requiredBtu, system.cooldownFactor),
        sizingStatus: status,
      };

      trace.push(
        `${recommendation.systemLabel}: score ${recommendation.score}; capacity ratio ${round(capacityBtu / requiredBtu, 2)}; reasons: ${rankReasons.join(", ")}.`,
      );

      return recommendation;
    });

  if (possibleSystems.length === 0) {
    throw new Error("No compatible AC systems found for this cooling requirement.");
  }

  const rankedWithScore = [...possibleSystems].sort((a, b) => b.rankingScore - a.rankingScore);
  const rankedRecommendations = rankedWithScore.map(({ rankingScore, ...system }) => system);
  const bestMatch = rankedRecommendations[0];
  const alternativeOptions = rankedRecommendations.slice(1, 4);

  const oversize = rankedRecommendations.find((system) => system.sizingStatus === "oversized");
  const undersize = rankedRecommendations.find((system) => system.sizingStatus === "undersized");

  return {
    possibleSystems,
    rankedRecommendations,
    bestMatch,
    alternativeOptions,
    explanationText: [
      `Cooling requirement supports ${possibleSystems.length} compatible system type(s), so the recommendation is ranked by fit, comfort, cost, and constraints rather than BTU alone.`,
      ...bestMatch.rankReasons.slice(0, 3),
    ],
    oversizeWarning: oversize
      ? `${oversize.systemLabel} may be oversized against the calculated load; confirm after a site survey.`
      : undefined,
    undersizeWarning: undersize
      ? `${undersize.systemLabel} may be undersized during peak heat; choose the next size up if the room gets heavy afternoon sun.`
      : undefined,
    trace,
  };
}
