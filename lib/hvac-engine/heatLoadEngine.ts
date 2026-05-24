import { hvacConfig } from "./config";
import type { AirconLoadInputs, ApplianceInputs, HeatLoadResult } from "./types";

type ValidatedHeatLoadInputs = Omit<Required<AirconLoadInputs>, "appliances"> & {
  appliances: Required<ApplianceInputs>;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function round(value: number, precision = 0): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function toNumberOrDefault(value: unknown, fallback: number): number {
  return isFiniteNumber(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeAppliances(appliances?: Partial<ApplianceInputs>): Required<ApplianceInputs> {
  return {
    tv: Math.max(0, Math.floor(toNumberOrDefault(appliances?.tv, 0))),
    computer: Math.max(0, Math.floor(toNumberOrDefault(appliances?.computer, 0))),
    refrigerator: Math.max(0, Math.floor(toNumberOrDefault(appliances?.refrigerator, 0))),
    microwave: Math.max(0, Math.floor(toNumberOrDefault(appliances?.microwave, 0))),
    lightingWatts: Math.max(0, toNumberOrDefault(appliances?.lightingWatts, 0)),
    otherWatts: Math.max(0, toNumberOrDefault(appliances?.otherWatts, 0)),
  };
}

export function validateHeatLoadInputs(inputs: AirconLoadInputs): {
  validated: ValidatedHeatLoadInputs;
  warnings: string[];
} {
  if (!inputs || typeof inputs !== "object") {
    throw new Error("Inputs must be a non-null object.");
  }

  const { heatLoad } = hvacConfig;
  const areaSqm = Number(inputs.areaSqm);
  if (!isFiniteNumber(areaSqm)) {
    throw new Error("areaSqm must be a valid number.");
  }
  if (areaSqm < heatLoad.validation.minAreaSqm || areaSqm > heatLoad.validation.maxAreaSqm) {
    throw new Error(
      `areaSqm must be between ${heatLoad.validation.minAreaSqm} and ${heatLoad.validation.maxAreaSqm}.`,
    );
  }

  const ceilingHeightM = toNumberOrDefault(
    inputs.ceilingHeightM,
    heatLoad.defaults.ceilingHeightM,
  );
  if (
    ceilingHeightM < heatLoad.validation.minCeilingHeightM ||
    ceilingHeightM > heatLoad.validation.maxCeilingHeightM
  ) {
    throw new Error(
      `ceilingHeightM must be between ${heatLoad.validation.minCeilingHeightM} and ${heatLoad.validation.maxCeilingHeightM}.`,
    );
  }

  const sunExposure = inputs.sunExposure ?? heatLoad.defaults.sunExposure;
  const windowRatio = inputs.windowRatio ?? heatLoad.defaults.windowRatio;
  const roomType = inputs.roomType ?? heatLoad.defaults.roomType;
  const insulation = inputs.insulation ?? heatLoad.defaults.insulation;
  const occupancy = Math.floor(toNumberOrDefault(inputs.occupancy, heatLoad.defaults.occupancy));

  if (!(sunExposure in hvacConfig.solarAdjustments)) {
    throw new Error("sunExposure must be one of: none, low, medium, high, very_high.");
  }
  if (!(windowRatio in hvacConfig.environmentalWeights.windowRatio)) {
    throw new Error("windowRatio must be one of: low, medium, high.");
  }
  if (!(roomType in hvacConfig.roomProfiles)) {
    throw new Error("roomType is invalid.");
  }
  if (!(insulation in hvacConfig.environmentalWeights.insulation)) {
    throw new Error("insulation must be one of: poor, average, good.");
  }
  if (
    occupancy < heatLoad.validation.minOccupancy ||
    occupancy > heatLoad.validation.maxOccupancy
  ) {
    throw new Error(
      `occupancy must be between ${heatLoad.validation.minOccupancy} and ${heatLoad.validation.maxOccupancy}.`,
    );
  }

  const warnings: string[] = [];
  if (roomType === "bedroom" && areaSqm > heatLoad.validation.bedroomHighAreaSqm) {
    warnings.push("Bedroom area is unusually large; confirm dimensions or consider zoning.");
  }
  if (occupancy / areaSqm > heatLoad.validation.denseOccupancyPerSqm) {
    warnings.push("High occupancy density detected; ventilation and fresh-air needs should be checked.");
  }
  if (ceilingHeightM > 4 && areaSqm < 15) {
    warnings.push("Very high ceiling in a small room can make airflow placement more important than size alone.");
  }

  return {
    validated: {
      areaSqm,
      ceilingHeightM,
      sunExposure,
      windowRatio,
      occupancy,
      roomType,
      insulation,
      appliances: normalizeAppliances(inputs.appliances),
    },
    warnings,
  };
}

function interpolateCeilingMultiplier(heightM: number): number {
  const points = hvacConfig.environmentalWeights.ceilingPoints;
  const safeHeight = clamp(heightM, points[0][0], points[points.length - 1][0]);

  for (let i = 0; i < points.length - 1; i += 1) {
    const [h1, m1] = points[i];
    const [h2, m2] = points[i + 1];
    if (safeHeight >= h1 && safeHeight <= h2) {
      const ratio = (safeHeight - h1) / (h2 - h1);
      return m1 + ratio * (m2 - m1);
    }
  }

  return points[points.length - 1][1];
}

function calculateApplianceHeatGain(appliances: Required<ApplianceInputs>): number {
  const gain = hvacConfig.applianceHeatBtu;
  return (
    appliances.tv * gain.tv +
    appliances.computer * gain.computer +
    appliances.refrigerator * gain.refrigerator +
    appliances.microwave * gain.microwave +
    appliances.lightingWatts * gain.lightingWattsMultiplier +
    appliances.otherWatts * gain.otherWattsMultiplier
  );
}

function buildAdjustment(
  key: string,
  label: string,
  subtotalBtu: number,
  multiplier: number,
  explanation: string,
) {
  return {
    key,
    label,
    value: round(multiplier, 2),
    effectBtu: round(subtotalBtu * (multiplier - 1)),
    explanation,
  };
}

function calculateConfidence(validated: ValidatedHeatLoadInputs, validationWarnings: string[]): number {
  let confidence = 90;
  if (validated.sunExposure === "very_high") confidence -= 5;
  if (validated.windowRatio === "high") confidence -= 4;
  if (validated.insulation === "poor") confidence -= 4;
  if (validated.areaSqm > 80) confidence -= 6;
  confidence -= validationWarnings.length * 4;
  return clamp(confidence, 60, 95);
}

export function calculateHeatLoad(rawInputs: AirconLoadInputs): HeatLoadResult {
  const { validated, warnings } = validateHeatLoadInputs(rawInputs);
  const profile = hvacConfig.roomProfiles[validated.roomType];
  const solar = hvacConfig.solarAdjustments[validated.sunExposure];

  const baseBtu = validated.areaSqm * hvacConfig.heatLoad.btuPerSqm;
  const occupancyBtu = validated.occupancy * profile.occupancyBtu;
  const applianceBtu = calculateApplianceHeatGain(validated.appliances);
  const subtotalBtu = baseBtu + occupancyBtu + applianceBtu;

  const ceilingMultiplier = interpolateCeilingMultiplier(validated.ceilingHeightM);
  const windowMultiplier = hvacConfig.environmentalWeights.windowRatio[validated.windowRatio];
  const insulationMultiplier = hvacConfig.environmentalWeights.insulation[validated.insulation];
  const roomTypeMultiplier = profile.multiplier;
  const cumulativeMultiplier =
    ceilingMultiplier *
    solar.multiplier *
    windowMultiplier *
    insulationMultiplier *
    roomTypeMultiplier;

  const requiredBtu = round(
    subtotalBtu * cumulativeMultiplier * hvacConfig.heatLoad.safetyBuffer,
  );

  if (!Number.isFinite(requiredBtu) || requiredBtu <= 0) {
    throw new Error("Invalid cooling-load output.");
  }

  const adjustments = [
    buildAdjustment(
      "ceiling",
      "Ceiling height",
      subtotalBtu,
      ceilingMultiplier,
      `${validated.ceilingHeightM} m ceiling changes room air volume.`,
    ),
    buildAdjustment("solar", "Solar exposure", subtotalBtu, solar.multiplier, solar.explanation),
    buildAdjustment(
      "windows",
      "Window exposure",
      subtotalBtu,
      windowMultiplier,
      `${validated.windowRatio} window ratio affects radiant heat gain.`,
    ),
    buildAdjustment(
      "insulation",
      "Insulation",
      subtotalBtu,
      insulationMultiplier,
      `${validated.insulation} insulation changes heat transfer through walls and roof.`,
    ),
    buildAdjustment(
      "room_profile",
      "Room profile",
      subtotalBtu,
      roomTypeMultiplier,
      `${validated.roomType.replace("_", " ")} profile adjusts expected sensible and latent load.`,
    ),
    buildAdjustment(
      "safety_buffer",
      "Tropical safety buffer",
      subtotalBtu * cumulativeMultiplier,
      hvacConfig.heatLoad.safetyBuffer,
      "Adds reserve for Philippine peak conditions and normal installation losses.",
    ),
  ];

  const trace = [
    `Base load: ${round(validated.areaSqm, 1)} sqm x ${hvacConfig.heatLoad.btuPerSqm} BTU/sqm = ${round(baseBtu).toLocaleString()} BTU/hr.`,
    `People load: ${validated.occupancy} occupant(s) x ${profile.occupancyBtu} BTU/hr = ${round(occupancyBtu).toLocaleString()} BTU/hr.`,
    `Appliance load: ${round(applianceBtu).toLocaleString()} BTU/hr from selected equipment.`,
    `Combined multiplier: ${round(cumulativeMultiplier, 2)} before safety buffer.`,
    `Final load: ${requiredBtu.toLocaleString()} BTU/hr after ${Math.round((hvacConfig.heatLoad.safetyBuffer - 1) * 100)}% buffer.`,
    ...warnings,
  ];

  return {
    requiredBtu,
    confidenceScore: calculateConfidence(validated, warnings),
    adjustmentBreakdown: {
      baseBtu: round(baseBtu),
      occupancyBtu: round(occupancyBtu),
      applianceBtu: round(applianceBtu),
      subtotalBtu: round(subtotalBtu),
      multipliers: {
        ceiling: round(ceilingMultiplier, 2),
        solar: round(solar.multiplier, 2),
        windows: round(windowMultiplier, 2),
        insulation: round(insulationMultiplier, 2),
        roomProfile: round(roomTypeMultiplier, 2),
        cumulative: round(cumulativeMultiplier, 2),
      },
      safetyBuffer: hvacConfig.heatLoad.safetyBuffer,
      adjustments,
      trace,
    },
  };
}
