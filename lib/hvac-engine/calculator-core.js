/**
 * Aicon HVAC Design Assistant — Philippine Contractor Edition
 * -----------------------------------------------------------
 * TypeScript-compatible JavaScript module that turns raw room inputs into a
 * full preliminary HVAC proposal: cooling load, TR sizing, project-scale
 * classification, recommended system architectures (indoor + outdoor +
 * zoning), and contractor notes.
 *
 * Pipeline (each stage exported for re-use):
 *   1. validateInputs()              – defensive validation
 *   2. calculateCoolingLoad()        – BTU/h, TR, HP and a transparent breakdown
 *   3. classifyProjectScale()        – tier (small_residential ... industrial_scale)
 *   4. determineSystemCategories()   – realistic candidate systems per tier
 *   5. generateCommercialRecommendations()
 *                                   – contractor-style architecture options
 *   6. generateIndoorUnitLayout()    – realistic indoor unit distribution
 *   7. generateContractorNotes()     – preliminary-vs-final notes & warnings
 *   8. calculateAirconLoad()         – orchestrator that runs the full pipeline
 *
 * Output is JSON-serializable and safe for API/UI/mobile consumption.
 */

const CONFIG = Object.freeze({
  baseBtuPerSqm: 550,
  safetyBuffer: 1.15,
  minAreaSqm: 5,
  maxAreaSqm: 5000,
  defaultCeilingHeightM: 2.7,
  defaultOccupancy: 1,
  minCeilingHeightM: 2.0,
  maxCeilingHeightM: 12.0,
  minOccupancy: 1,
  maxOccupancy: 2000,
  btuPerTon: 12000,
  btuPerHp: 9000,
});

/** @typedef {"none"|"low"|"medium"|"high"|"very_high"} SunExposure */
/** @typedef {"low"|"medium"|"high"} WindowRatio */
/** @typedef {"poor"|"average"|"good"} Insulation */
/** @typedef {"bedroom"|"living_room"|"office"|"commercial_hall"|"restaurant"|"server_room"|"gym"|"classroom"|"retail_store"} RoomType */
/** @typedef {"window_type"|"wall_split"|"multi_split"|"ceiling_cassette"|"floor_mounted"|"packaged_unit"|"vrf_vrv"|"ducted_system"|"centralized"|"chilled_water"} SystemType */
/** @typedef {"residential"|"commercial"|"industrial"|"mission_critical"|"large_commercial"} ApplicationType */
/** @typedef {"small_residential"|"large_residential"|"light_commercial"|"medium_commercial"|"large_commercial"|"industrial_scale"} ScaleCategory */

/**
 * @typedef {Object} ApplianceInputs
 * @property {number} tv
 * @property {number} computer
 * @property {number} refrigerator
 * @property {number} microwave
 * @property {number} lightingWatts
 * @property {number} otherWatts
 */

/**
 * @typedef {Object} AirconLoadInputs
 * @property {number} areaSqm
 * @property {number=} ceilingHeightM
 * @property {SunExposure=} sunExposure
 * @property {WindowRatio=} windowRatio
 * @property {number=} occupancy
 * @property {RoomType=} roomType
 * @property {Insulation=} insulation
 * @property {Partial<ApplianceInputs>=} appliances
 */

/**
 * @typedef {Object} CoolingLoadResult
 * @property {number} totalBtu
 * @property {number} totalHp
 * @property {number} totalTR
 * @property {Object} breakdown
 */

/**
 * @typedef {Object} ProjectClassification
 * @property {ScaleCategory} scaleCategory
 * @property {string} scaleLabel
 * @property {number} estimatedTR
 * @property {ApplicationType} applicationType
 */

/**
 * @typedef {Object} HvacSubsystem
 * @property {string} type
 * @property {number} quantity
 * @property {string} capacity
 * @property {string=} capacityPerUnit
 * @property {string=} layoutConcept
 */

/**
 * @typedef {Object} HvacSystemOption
 * @property {SystemType} systemType
 * @property {string} systemLabel
 * @property {string} recommendedUseCase
 * @property {HvacSubsystem} outdoorSystem
 * @property {HvacSubsystem} indoorSystem
 * @property {string} zoningStrategy
 * @property {string[]} advantages
 * @property {string[]} considerations
 */

const MULTIPLIERS = Object.freeze({
  sunExposure: Object.freeze({
    none: 0.9,
    low: 1.0,
    medium: 1.15,
    high: 1.3,
    very_high: 1.45,
  }),
  windowRatio: Object.freeze({
    low: 0.95,
    medium: 1.1,
    high: 1.3,
  }),
  insulation: Object.freeze({
    poor: 1.25,
    average: 1.0,
    good: 0.85,
  }),
  roomType: Object.freeze({
    bedroom: 0.8,
    living_room: 0.9,
    office: 1.0,
    commercial_hall: 1.15,
    restaurant: 1.35,
    server_room: 1.6,
    gym: 1.4,
    classroom: 1.1,
    retail_store: 1.2,
  }),
});

const OCCUPANCY_BTU_PER_PERSON = Object.freeze({
  bedroom: 400,
  living_room: 450,
  office: 600,
  commercial_hall: 700,
  restaurant: 900,
  server_room: 300,
  gym: 1000,
  classroom: 650,
  retail_store: 700,
});

const APPLIANCE_GAIN = Object.freeze({
  tv: 400,
  computer: 600,
  refrigerator: 1200,
  microwave: 1500,
  lightingWattsMultiplier: 3.41,
  otherWattsMultiplier: 3.41,
});

const CEILING_POINTS = Object.freeze([
  [2.4, 0.95],
  [2.7, 1.0],
  [3.0, 1.08],
  [3.5, 1.2],
  [4.0, 1.35],
  [5.0, 1.55],
  [6.0, 1.75],
  [8.0, 2.0],
]);

const PROJECT_SCALE_TIERS = Object.freeze({
  small_residential: {
    maxTR: 2,
    label: "Small Residential",
    applicationType: "residential",
    systems: ["window_type", "wall_split"],
  },
  large_residential: {
    maxTR: 5,
    label: "Large Residential",
    applicationType: "residential",
    systems: ["wall_split", "multi_split", "ceiling_cassette"],
  },
  light_commercial: {
    maxTR: 12,
    label: "Light Commercial",
    applicationType: "commercial",
    systems: ["ceiling_cassette", "floor_mounted", "multi_split"],
  },
  medium_commercial: {
    maxTR: 25,
    label: "Medium Commercial",
    applicationType: "commercial",
    systems: ["ceiling_cassette", "packaged_unit", "vrf_vrv"],
  },
  large_commercial: {
    maxTR: 60,
    label: "Large Commercial",
    applicationType: "commercial",
    systems: ["vrf_vrv", "packaged_unit", "ducted_system"],
  },
  industrial_scale: {
    maxTR: 999,
    label: "Industrial / Institutional",
    applicationType: "industrial",
    systems: ["vrf_vrv", "centralized", "chilled_water"],
  },
});

const SCALE_ORDER = Object.freeze([
  "small_residential",
  "large_residential",
  "light_commercial",
  "medium_commercial",
  "large_commercial",
  "industrial_scale",
]);

const COMMERCIAL_ROOM_TYPES = new Set([
  "commercial_hall",
  "restaurant",
  "server_room",
  "gym",
  "classroom",
  "retail_store",
]);

/** Cassette HP -> realistic per-unit coverage (sqm). */
const CASSETTE_COVERAGE_SQM = Object.freeze({
  2.0: 25,
  2.5: 35,
  3.0: 45,
  5.0: 70,
});

const PACKAGED_UNIT_TR = Object.freeze([5, 7.5, 10, 12.5, 15, 20]);
const VRF_OUTDOOR_MODULES_HP = Object.freeze([8, 10, 12, 14, 16, 20]);
const WALL_SPLIT_HP_CATALOG = Object.freeze([1.0, 1.5, 2.0, 2.5, 3.0]);
const WINDOW_TYPE_HP_CATALOG = Object.freeze([0.75, 1.0, 1.5, 2.0]);
const FLOOR_MOUNTED_HP_CATALOG = Object.freeze([2.0, 2.5, 3.0, 5.0, 6.0]);

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function toNumberOrDefault(value, fallback) {
  if (!isFiniteNumber(value)) return fallback;
  return value;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function round0(value) {
  return Math.round(value);
}

/**
 * Validates and normalizes user inputs.
 * @param {AirconLoadInputs} inputs
 * @returns {Required<AirconLoadInputs>}
 */
export function validateInputs(inputs) {
  if (!inputs || typeof inputs !== "object") {
    throw new Error("Inputs must be a non-null object.");
  }

  const areaSqm = Number(inputs.areaSqm);
  if (!isFiniteNumber(areaSqm)) {
    throw new Error("areaSqm must be a valid number.");
  }
  if (areaSqm < CONFIG.minAreaSqm || areaSqm > CONFIG.maxAreaSqm) {
    throw new Error(
      `areaSqm must be between ${CONFIG.minAreaSqm} and ${CONFIG.maxAreaSqm}.`,
    );
  }

  const ceilingHeightM = toNumberOrDefault(
    inputs.ceilingHeightM,
    CONFIG.defaultCeilingHeightM,
  );
  if (!isFiniteNumber(ceilingHeightM)) {
    throw new Error("ceilingHeightM must be a valid number.");
  }
  if (
    ceilingHeightM < CONFIG.minCeilingHeightM ||
    ceilingHeightM > CONFIG.maxCeilingHeightM
  ) {
    throw new Error(
      `ceilingHeightM must be between ${CONFIG.minCeilingHeightM} and ${CONFIG.maxCeilingHeightM}.`,
    );
  }

  const sunExposure = inputs.sunExposure ?? "low";
  if (!(sunExposure in MULTIPLIERS.sunExposure)) {
    throw new Error("sunExposure must be one of: none, low, medium, high, very_high.");
  }

  const windowRatio = inputs.windowRatio ?? "medium";
  if (!(windowRatio in MULTIPLIERS.windowRatio)) {
    throw new Error("windowRatio must be one of: low, medium, high.");
  }

  const roomType = inputs.roomType ?? "bedroom";
  if (!(roomType in MULTIPLIERS.roomType)) {
    throw new Error("roomType is invalid.");
  }

  const insulation = inputs.insulation ?? "average";
  if (!(insulation in MULTIPLIERS.insulation)) {
    throw new Error("insulation must be one of: poor, average, good.");
  }

  const occupancy = Math.floor(
    toNumberOrDefault(inputs.occupancy, CONFIG.defaultOccupancy),
  );
  if (!isFiniteNumber(occupancy)) {
    throw new Error("occupancy must be a valid number.");
  }
  if (occupancy < CONFIG.minOccupancy || occupancy > CONFIG.maxOccupancy) {
    throw new Error(
      `occupancy must be between ${CONFIG.minOccupancy} and ${CONFIG.maxOccupancy}.`,
    );
  }

  const appliances = {
    tv: Math.max(0, Math.floor(toNumberOrDefault(inputs.appliances?.tv, 0))),
    computer: Math.max(
      0,
      Math.floor(toNumberOrDefault(inputs.appliances?.computer, 0)),
    ),
    refrigerator: Math.max(
      0,
      Math.floor(toNumberOrDefault(inputs.appliances?.refrigerator, 0)),
    ),
    microwave: Math.max(
      0,
      Math.floor(toNumberOrDefault(inputs.appliances?.microwave, 0)),
    ),
    lightingWatts: Math.max(
      0,
      toNumberOrDefault(inputs.appliances?.lightingWatts, 0),
    ),
    otherWatts: Math.max(
      0,
      toNumberOrDefault(inputs.appliances?.otherWatts, 0),
    ),
  };

  return {
    areaSqm,
    ceilingHeightM,
    sunExposure,
    windowRatio,
    occupancy,
    roomType,
    insulation,
    appliances,
  };
}

/**
 * Piecewise linear interpolation for ceiling height multiplier.
 * @param {number} heightM
 * @returns {number}
 */
export function interpolateCeilingMultiplier(heightM) {
  const safeHeight = clamp(
    heightM,
    CEILING_POINTS[0][0],
    CEILING_POINTS[CEILING_POINTS.length - 1][0],
  );
  for (let i = 0; i < CEILING_POINTS.length - 1; i += 1) {
    const [h1, m1] = CEILING_POINTS[i];
    const [h2, m2] = CEILING_POINTS[i + 1];
    if (safeHeight >= h1 && safeHeight <= h2) {
      const ratio = (safeHeight - h1) / (h2 - h1);
      return m1 + ratio * (m2 - m1);
    }
  }
  return CEILING_POINTS[CEILING_POINTS.length - 1][1];
}

/**
 * @param {ApplianceInputs} appliances
 * @returns {number}
 */
export function calculateApplianceHeatGain(appliances) {
  if (!appliances || typeof appliances !== "object") return 0;

  const tv = Math.max(0, Math.floor(toNumberOrDefault(appliances.tv, 0)));
  const computer = Math.max(
    0,
    Math.floor(toNumberOrDefault(appliances.computer, 0)),
  );
  const refrigerator = Math.max(
    0,
    Math.floor(toNumberOrDefault(appliances.refrigerator, 0)),
  );
  const microwave = Math.max(
    0,
    Math.floor(toNumberOrDefault(appliances.microwave, 0)),
  );
  const lightingWatts = Math.max(
    0,
    toNumberOrDefault(appliances.lightingWatts, 0),
  );
  const otherWatts = Math.max(0, toNumberOrDefault(appliances.otherWatts, 0));

  const fixedGain =
    tv * APPLIANCE_GAIN.tv +
    computer * APPLIANCE_GAIN.computer +
    refrigerator * APPLIANCE_GAIN.refrigerator +
    microwave * APPLIANCE_GAIN.microwave;

  const variableGain =
    lightingWatts * APPLIANCE_GAIN.lightingWattsMultiplier +
    otherWatts * APPLIANCE_GAIN.otherWattsMultiplier;

  return Math.max(0, fixedGain + variableGain);
}

/**
 * Stage 1: pure cooling-load calculation.
 * @param {AirconLoadInputs} rawInputs
 * @returns {CoolingLoadResult}
 */
export function calculateCoolingLoad(rawInputs) {
  const validated = validateInputs(rawInputs);

  const baseBtu = validated.areaSqm * CONFIG.baseBtuPerSqm;
  const occupancyBtu =
    validated.occupancy * OCCUPANCY_BTU_PER_PERSON[validated.roomType];
  const applianceBtu = calculateApplianceHeatGain(validated.appliances);

  const ceilingMultiplier = interpolateCeilingMultiplier(
    validated.ceilingHeightM,
  );
  const sunMultiplier = MULTIPLIERS.sunExposure[validated.sunExposure];
  const windowMultiplier = MULTIPLIERS.windowRatio[validated.windowRatio];
  const insulationMultiplier = MULTIPLIERS.insulation[validated.insulation];
  const roomTypeMultiplier = MULTIPLIERS.roomType[validated.roomType];

  const subtotal = baseBtu + occupancyBtu + applianceBtu;
  const cumulativeMultiplier =
    ceilingMultiplier *
    sunMultiplier *
    windowMultiplier *
    insulationMultiplier *
    roomTypeMultiplier;

  const totalBtu = round2(subtotal * cumulativeMultiplier * CONFIG.safetyBuffer);
  const totalHp = round2(totalBtu / CONFIG.btuPerHp);
  const totalTR = round2(totalBtu / CONFIG.btuPerTon);

  if (
    !Number.isFinite(totalBtu) ||
    !Number.isFinite(totalHp) ||
    !Number.isFinite(totalTR) ||
    totalBtu < 0
  ) {
    throw new Error("Invalid cooling-load output.");
  }

  return {
    totalBtu,
    totalHp,
    totalTR,
    breakdown: {
      baseBtu: round2(baseBtu),
      occupancyBtu: round2(occupancyBtu),
      applianceBtu: round2(applianceBtu),
      multiplierEffects: {
        ceilingMultiplier: round2(ceilingMultiplier),
        sunExposureMultiplier: round2(sunMultiplier),
        windowRatioMultiplier: round2(windowMultiplier),
        insulationMultiplier: round2(insulationMultiplier),
        roomTypeMultiplier: round2(roomTypeMultiplier),
        cumulativeMultiplier: round2(cumulativeMultiplier),
        safetyBuffer: CONFIG.safetyBuffer,
      },
    },
  };
}

function refineApplicationType({ defaultType, roomType, areaSqm }) {
  if (COMMERCIAL_ROOM_TYPES.has(roomType) && defaultType === "residential") {
    return "commercial";
  }
  if (roomType === "server_room") return "mission_critical";
  if (areaSqm > 800 && defaultType === "commercial") return "large_commercial";
  return defaultType;
}

/**
 * Stage 2: classify project scale based on TR.
 * @param {number} totalTR
 * @param {{ roomType: RoomType, areaSqm: number }} ctx
 * @returns {ProjectClassification}
 */
export function classifyProjectScale(totalTR, { roomType, areaSqm }) {
  for (const key of SCALE_ORDER) {
    const tier = PROJECT_SCALE_TIERS[key];
    if (totalTR <= tier.maxTR) {
      return {
        scaleCategory: key,
        scaleLabel: tier.label,
        estimatedTR: round2(totalTR),
        applicationType: refineApplicationType({
          defaultType: tier.applicationType,
          roomType,
          areaSqm,
        }),
      };
    }
  }
  return {
    scaleCategory: "industrial_scale",
    scaleLabel: PROJECT_SCALE_TIERS.industrial_scale.label,
    estimatedTR: round2(totalTR),
    applicationType: "industrial",
  };
}

/**
 * Stage 3: determine which HVAC categories are realistic for this project.
 * @param {ProjectClassification} classification
 * @param {{ areaSqm: number, roomType: RoomType, totalTR: number }} ctx
 * @returns {SystemType[]}
 */
export function determineSystemCategories(classification, { areaSqm, roomType, totalTR }) {
  const tier = PROJECT_SCALE_TIERS[classification.scaleCategory];
  const candidates = [...tier.systems];

  const rules = (system) => {
    if (system === "window_type" && (areaSqm > 40 || totalTR > 2)) return true;
    if (system === "wall_split" && (areaSqm > 150 || totalTR > 5)) return true;
    if (system === "multi_split" && totalTR > 8) return true;
    if (system === "floor_mounted" && areaSqm < 25) return true;
    if (system === "packaged_unit" && totalTR < 5) return true;
    if (system === "vrf_vrv" && totalTR < 8) return true;
    if (system === "ducted_system" && totalTR < 10) return true;
    if (system === "centralized" && totalTR < 50) return true;
    if (system === "chilled_water" && totalTR < 60) return true;
    return false;
  };

  let result = candidates.filter((sys) => !rules(sys));

  if (
    COMMERCIAL_ROOM_TYPES.has(roomType) &&
    totalTR >= 8 &&
    !result.includes("vrf_vrv")
  ) {
    result.push("vrf_vrv");
  }
  if (
    (roomType === "commercial_hall" ||
      roomType === "gym" ||
      roomType === "restaurant") &&
    totalTR >= 7.5 &&
    !result.includes("packaged_unit")
  ) {
    result.push("packaged_unit");
  }

  if (result.length === 0) {
    result = [tier.systems[0]];
  }
  return result;
}

function pickHpFromCatalog(targetBtu, catalog) {
  for (const hp of catalog) {
    if (hp * CONFIG.btuPerHp >= targetBtu * 0.95) return hp;
  }
  return catalog[catalog.length - 1];
}

/**
 * Stage 5: realistic indoor unit layout.
 * @param {{ indoorType: string, quantity: number, hpPerUnit: number, areaSqm: number, sunExposure: SunExposure }} args
 * @returns {HvacSubsystem}
 */
export function generateIndoorUnitLayout({ indoorType, quantity, hpPerUnit, areaSqm, sunExposure }) {
  const perUnitArea = quantity > 0 ? areaSqm / quantity : areaSqm;
  const hotFacade = sunExposure === "high" || sunExposure === "very_high";

  let layout;
  if (quantity <= 1) {
    layout =
      "Single indoor unit positioned to throw airflow across the longest axis.";
  } else if (indoorType === "ceiling_cassette") {
    layout = hotFacade
      ? `Distribute ${quantity} 4-way cassettes evenly across the ceiling grid; weight extra units toward sun-exposed perimeter for solar load balancing.`
      : `Distribute ${quantity} 4-way cassettes evenly across the ceiling grid (~${round0(perUnitArea)} sqm each).`;
  } else if (indoorType === "wall_split") {
    layout = hotFacade
      ? `Mount ${quantity} wall-split heads on shaded walls firing toward the sun-exposed facade to counter peak solar gain.`
      : `Place ${quantity} wall-split heads at opposite walls so airflows interlock and cover the room evenly.`;
  } else if (indoorType === "floor_mounted") {
    layout = `Stand ${quantity} floor-mounted units along the longest wall, ideally below glazing, to wash cold air upward across the glass.`;
  } else if (indoorType === "ducted_indoors") {
    layout = `Centralized air-handling unit feeding ${quantity > 1 ? `${quantity} supply trunks` : "a supply trunk"} with diffusers spaced ~3-4 m on center.`;
  } else if (indoorType === "window_type") {
    layout =
      "Through-wall sleeve installation on the shaded facade with a return-air path back to the unit.";
  } else {
    layout = `Distribute ${quantity} indoor units evenly with per-unit coverage of ~${round0(perUnitArea)} sqm.`;
  }

  return {
    type: indoorType,
    quantity,
    capacity: `${round1(hpPerUnit * quantity)} HP total`,
    capacityPerUnit: `${round1(hpPerUnit)} HP each`,
    layoutConcept: layout,
  };
}

function buildWindowTypeOption(totalBtu, areaSqm) {
  const hp = pickHpFromCatalog(totalBtu, WINDOW_TYPE_HP_CATALOG);
  return {
    systemType: "window_type",
    systemLabel: "Window-Type Air Conditioner",
    recommendedUseCase:
      "Single small room, budget residential install, no separate condenser space available.",
    outdoorSystem: {
      type: "integrated_condenser",
      quantity: 0,
      capacity: "Built into the indoor unit (no separate outdoor unit).",
    },
    indoorSystem: generateIndoorUnitLayout({
      indoorType: "window_type",
      quantity: 1,
      hpPerUnit: hp,
      areaSqm,
      sunExposure: "low",
    }),
    zoningStrategy: "Single-zone, single-thermostat operation.",
    advantages: [
      "Lowest equipment cost in the residential category",
      "Self-contained installation with no refrigerant lines",
      "Simple to service and replace",
    ],
    considerations: [
      "Higher noise level inside the room",
      "Requires a wall sleeve or window opening",
      "Limited efficiency vs. inverter splits",
    ],
  };
}

function buildWallSplitOption(totalBtu, areaSqm, sunExposure) {
  const hpPerUnit = pickHpFromCatalog(totalBtu, WALL_SPLIT_HP_CATALOG);
  const perUnitBtu = hpPerUnit * CONFIG.btuPerHp;
  const quantity = Math.max(1, Math.ceil(totalBtu / (perUnitBtu * 0.95)));
  return {
    systemType: "wall_split",
    systemLabel: "Wall-Mounted Split Type",
    recommendedUseCase:
      "Bedrooms, small offices, and partitioned residential zones up to ~150 sqm.",
    outdoorSystem: {
      type: "condenser",
      quantity,
      capacity: `${round1(hpPerUnit)} HP each`,
      capacityPerUnit: `${round1(hpPerUnit)} HP`,
    },
    indoorSystem: generateIndoorUnitLayout({
      indoorType: "wall_split",
      quantity,
      hpPerUnit,
      areaSqm,
      sunExposure,
    }),
    zoningStrategy:
      "One indoor head per partitioned zone; each zone runs on its own remote/thermostat.",
    advantages: [
      "Common, easy to source from local suppliers",
      "Inverter models give good part-load efficiency",
      "Short refrigerant runs simplify installation",
    ],
    considerations: [
      "One outdoor unit per zone takes up facade space",
      "Not ideal for halls or open-plan areas above 150 sqm",
      "Multiple condensers may complicate exterior aesthetics",
    ],
  };
}

function buildMultiSplitOption(totalBtu, areaSqm, sunExposure) {
  const hpPerUnit = pickHpFromCatalog(totalBtu / 4, WALL_SPLIT_HP_CATALOG);
  const perUnitBtu = hpPerUnit * CONFIG.btuPerHp;
  const indoorQty = Math.max(2, Math.ceil(totalBtu / (perUnitBtu * 0.95)));
  const outdoorQty = Math.ceil(indoorQty / 5);
  return {
    systemType: "multi_split",
    systemLabel: "Multi-Split (one outdoor, multiple indoors)",
    recommendedUseCase:
      "Large residences and small offices with 3-5 partitioned zones sharing a single condenser.",
    outdoorSystem: {
      type: "multi_split_outdoor",
      quantity: outdoorQty,
      capacity: `${round1(hpPerUnit * indoorQty)} HP combined nominal`,
      capacityPerUnit:
        "Each outdoor handles up to 5 indoor heads (mixed sizing)",
    },
    indoorSystem: generateIndoorUnitLayout({
      indoorType: "wall_split",
      quantity: indoorQty,
      hpPerUnit,
      areaSqm,
      sunExposure,
    }),
    zoningStrategy:
      "Independent thermostat per zone but shared compressor; non-running zones can be shut off without idling other rooms.",
    advantages: [
      "Reduces outdoor footprint vs. multiple stand-alone splits",
      "Per-room thermostat control",
      "Cleaner facade and shorter total piping",
    ],
    considerations: [
      "All indoor heads share one outdoor; outdoor failure affects all zones",
      "Requires careful refrigerant pipe sizing and balancing",
      "Limited to ~8 TR before VRF becomes more practical",
    ],
  };
}

function buildCeilingCassetteOption(totalBtu, areaSqm, sunExposure) {
  const entries = Object.entries(CASSETTE_COVERAGE_SQM)
    .map(([hp, area]) => [Number(hp), area])
    .sort((a, b) => a[0] - b[0]);

  let bestHp = entries[0][0];
  let bestQty = Math.ceil(areaSqm / entries[0][1]);
  let bestWaste = Number.POSITIVE_INFINITY;

  for (const [hp, area] of entries) {
    const qty = Math.max(1, Math.ceil(areaSqm / area));
    const installedBtu = qty * hp * CONFIG.btuPerHp;
    const waste = Math.abs(installedBtu - totalBtu);
    if (installedBtu >= totalBtu * 0.95 && waste < bestWaste) {
      bestWaste = waste;
      bestHp = hp;
      bestQty = qty;
    }
  }

  return {
    systemType: "ceiling_cassette",
    systemLabel: "4-Way Ceiling Cassette",
    recommendedUseCase:
      "Open commercial ceilings (offices, retail floors, restaurants, classrooms) where cassettes blend into the ceiling grid.",
    outdoorSystem: {
      type: "condenser",
      quantity: bestQty,
      capacity: `${round1(bestHp)} HP each (one outdoor per cassette)`,
      capacityPerUnit: `${round1(bestHp)} HP`,
    },
    indoorSystem: generateIndoorUnitLayout({
      indoorType: "ceiling_cassette",
      quantity: bestQty,
      hpPerUnit: bestHp,
      areaSqm,
      sunExposure,
    }),
    zoningStrategy:
      "Group cassettes by partition; pair adjacent units on a single thermostat for open-plan zones.",
    advantages: [
      "Even 4-way airflow distribution",
      "Hidden in the ceiling for clean architectural look",
      "Better fit than wall-splits for open commercial spaces",
    ],
    considerations: [
      "Requires a suspended/false ceiling with adequate plenum depth",
      "Multiple outdoor condensers still occupy facade or roof",
      "Servicing requires ceiling access panels",
    ],
  };
}

function buildFloorMountedOption(totalBtu, areaSqm) {
  const hpPerUnit = pickHpFromCatalog(totalBtu / 2, FLOOR_MOUNTED_HP_CATALOG);
  const perUnitBtu = hpPerUnit * CONFIG.btuPerHp;
  const quantity = Math.max(1, Math.ceil(totalBtu / (perUnitBtu * 0.95)));
  return {
    systemType: "floor_mounted",
    systemLabel: "Floor-Mounted / Console Type",
    recommendedUseCase:
      "Glass-fronted lobbies, showrooms, and rooms without ceiling space; airflow washes upward across glazing.",
    outdoorSystem: {
      type: "condenser",
      quantity,
      capacity: `${round1(hpPerUnit)} HP each`,
      capacityPerUnit: `${round1(hpPerUnit)} HP`,
    },
    indoorSystem: generateIndoorUnitLayout({
      indoorType: "floor_mounted",
      quantity,
      hpPerUnit,
      areaSqm,
      sunExposure: "low",
    }),
    zoningStrategy:
      "Place indoors below glazing or against perimeter walls; one zone per indoor head.",
    advantages: [
      "No ceiling clearance required",
      "Excellent for combating solar gain on tall windows",
      "Easy filter access for maintenance",
    ],
    considerations: [
      "Occupies floor / wall real estate at low level",
      "Less attractive aesthetically than concealed units",
      "Air throw is shorter than cassette systems",
    ],
  };
}

function buildPackagedUnitOption(totalTR, areaSqm, roomType) {
  const unitTR =
    PACKAGED_UNIT_TR.find((size) => size >= totalTR / 2) ??
    PACKAGED_UNIT_TR[PACKAGED_UNIT_TR.length - 1];
  const quantity = Math.max(1, Math.ceil(totalTR / unitTR));
  const diffusers = Math.max(quantity * 4, Math.ceil(areaSqm / 25));
  return {
    systemType: "packaged_unit",
    systemLabel: "Packaged Rooftop / Ducted Unit",
    recommendedUseCase:
      "Large open volumes (function halls, restaurants, retail, gyms) where a single ducted system is cleaner than multiple splits.",
    outdoorSystem: {
      type: "packaged_outdoor",
      quantity,
      capacity: `${round1(unitTR)} TR each`,
      capacityPerUnit: `${round1(unitTR)} TR`,
    },
    indoorSystem: {
      type: "ducted_diffusers",
      quantity: diffusers,
      capacity: "Single ducted system",
      capacityPerUnit: "Linear / square diffuser",
      layoutConcept: `Insulated supply duct mains run above ceiling; ${diffusers} diffusers distributed on a ~3-4 m grid with returns near each entry.`,
    },
    zoningStrategy: `Single thermostat per packaged unit; for ${roomType === "restaurant" ? "kitchen vs. dining separation" : "open halls"} consider VAV boxes or dampers per zone.`,
    advantages: [
      "One outdoor unit instead of dozens of small condensers",
      "Best aesthetics for large open spaces (hidden grilles only)",
      "Easier centralized maintenance and filter replacement",
    ],
    considerations: [
      "Requires ductwork design, static pressure calc, and ceiling space",
      "Roof or service yard required for the packaged outdoor",
      "Less per-zone temperature control than VRF",
    ],
  };
}

function buildVrfVrvOption(totalHp, totalTR, areaSqm, roomType) {
  const outdoorHp =
    VRF_OUTDOOR_MODULES_HP.find((hp) => hp >= totalHp / 2) ??
    VRF_OUTDOOR_MODULES_HP[VRF_OUTDOOR_MODULES_HP.length - 1];
  const outdoorQty = Math.max(1, Math.ceil(totalHp / outdoorHp));
  const indoorQty = Math.max(
    4,
    Math.ceil(areaSqm / (COMMERCIAL_ROOM_TYPES.has(roomType) ? 35 : 45)),
  );
  const indoorHp = round1(totalHp / indoorQty);
  return {
    systemType: "vrf_vrv",
    systemLabel: "VRF / VRV Inverter System",
    recommendedUseCase:
      "Multi-zone commercial buildings (offices, hotels, mixed-use) where each room needs independent control.",
    outdoorSystem: {
      type: "vrf_outdoor_module",
      quantity: outdoorQty,
      capacity: `${round1(outdoorHp)} HP module(s)`,
      capacityPerUnit: `${round1(outdoorHp)} HP`,
    },
    indoorSystem: {
      type: "vrf_indoor_mix",
      quantity: indoorQty,
      capacity: `~${round1(totalHp)} HP total indoor`,
      capacityPerUnit: `~${indoorHp.toFixed(1)} HP each (mixed types)`,
      layoutConcept:
        "Mix of 4-way cassettes for open areas and slim ducted/wall-mount heads for cellular offices, networked on a single refrigerant loop.",
    },
    zoningStrategy:
      "Independent thermostat per indoor unit, central BMS/controller for the building; simultaneous heating/cooling possible on heat-recovery variants.",
    advantages: [
      "Highest part-load efficiency for partial occupancy",
      "Per-room control with shared outdoor footprint",
      `Scales cleanly from ${indoorQty} up to dozens of indoor units`,
    ],
    considerations: [
      "Higher upfront cost than packaged or split systems",
      "Requires specialist commissioning and certified installer",
      "Long refrigerant runs need careful pipe sizing and leak detection",
    ],
  };
}

function buildDuctedSystemOption(totalTR, areaSqm, roomType) {
  const unitTR =
    PACKAGED_UNIT_TR.find((size) => size >= totalTR / 2) ??
    PACKAGED_UNIT_TR[PACKAGED_UNIT_TR.length - 1];
  const quantity = Math.max(1, Math.ceil(totalTR / unitTR));
  const zones = Math.max(4, Math.ceil(areaSqm / 80));
  return {
    systemType: "ducted_system",
    systemLabel: "Central Ducted Air-Handling System",
    recommendedUseCase:
      "Large commercial / institutional projects where centralized ducting and filtration matter (auditoriums, hospitals, schools).",
    outdoorSystem: {
      type: "condensing_unit",
      quantity,
      capacity: `${round1(unitTR)} TR per condenser`,
      capacityPerUnit: `${round1(unitTR)} TR`,
    },
    indoorSystem: {
      type: "air_handling_unit",
      quantity,
      capacity: `AHU per condenser; ducted to ${zones} zone(s)`,
      capacityPerUnit: "Matched to outdoor TR",
      layoutConcept:
        "Insulated supply/return ducts feed VAV or constant-volume boxes per zone, with linear diffusers along corridors and ceiling diffusers in rooms.",
    },
    zoningStrategy: `VAV boxes per zone with central thermostat schedule and per-room override; ${roomType === "classroom" ? "CO\u2082-based ventilation reset recommended" : "occupancy-based reset recommended"}.`,
    advantages: [
      "High filtration grade possible (MERV / HEPA)",
      "Centralized fresh-air handling and humidity control",
      "Long equipment life with proper maintenance",
    ],
    considerations: [
      "Requires significant ceiling plenum space",
      "Higher first cost; needs full mechanical design drawings",
      "Static pressure, balancing dampers, and noise must be engineered",
    ],
  };
}

function buildCentralizedOption(totalTR) {
  return {
    systemType: "centralized",
    systemLabel: "Central Air-Conditioning Plant",
    recommendedUseCase:
      "Large institutional or industrial facilities (>50 TR) requiring single-plant cooling distribution.",
    outdoorSystem: {
      type: "central_plant",
      quantity: 1,
      capacity: `~${round1(totalTR)} TR engineered plant`,
    },
    indoorSystem: {
      type: "distributed_ahu",
      quantity: 0,
      capacity: "Multiple AHUs / FCUs distributed by floor or zone",
      capacityPerUnit: "Sized per-floor in design phase",
      layoutConcept:
        "Plant feeds AHUs/FCUs through chilled-water or refrigerant headers; final indoor count is set in detailed engineering.",
    },
    zoningStrategy:
      "Per-floor or per-tenant zoning via AHUs/FCUs and BMS sequencing.",
    advantages: [
      "Lowest $/TR at this scale",
      "Centralized maintenance, single chiller/plant room",
      "Best long-term efficiency on large fully-occupied buildings",
    ],
    considerations: [
      "Requires full mechanical engineering design",
      "High capital cost and dedicated plant room",
      "Operations team / BMS required for reliable performance",
    ],
  };
}

function buildChilledWaterOption(totalTR) {
  return {
    systemType: "chilled_water",
    systemLabel: "Chilled-Water System with AHUs/FCUs",
    recommendedUseCase:
      "Hotels, hospitals, malls, factories (>60 TR) where chilled-water distribution is the industry standard.",
    outdoorSystem: {
      type: "water_cooled_chillers",
      quantity: Math.max(2, Math.ceil(totalTR / 100)),
      capacity: `~${round1(totalTR)} TR total chiller capacity`,
      capacityPerUnit:
        "N+1 chillers, sized per detailed engineering and redundancy strategy",
    },
    indoorSystem: {
      type: "ahu_and_fcu_network",
      quantity: 0,
      capacity: "AHUs for zones + FCUs for guest rooms / private offices",
      capacityPerUnit: "Sized per zone in design phase",
      layoutConcept:
        "Two-pipe or four-pipe chilled-water loop with cooling tower, primary/secondary pumping, and BMS sequencing.",
    },
    zoningStrategy:
      "Per-floor AHUs for common areas with FCUs in cellular spaces; chilled-water valves and CO\u2082 reset deliver granular control.",
    advantages: [
      "Industry-standard for large institutional & hospitality buildings",
      "Long equipment life, scalable redundancy (N+1)",
      "Best fit for combined comfort + process cooling loads",
    ],
    considerations: [
      "Requires full mechanical engineering, including pumping & cooling tower",
      "Highest capital cost and longest lead time",
      "Water treatment, condenser water loop, and BMS commissioning required",
    ],
  };
}

/**
 * Stage 4: convert candidate system types into contractor-style architecture options.
 * @param {{ candidateSystems: SystemType[], totalTR: number, totalHp: number, totalBtu: number, areaSqm: number, roomType: RoomType, sunExposure: SunExposure, occupancy: number }} args
 * @returns {HvacSystemOption[]}
 */
export function generateCommercialRecommendations({
  candidateSystems,
  totalTR,
  totalHp,
  totalBtu,
  areaSqm,
  roomType,
  sunExposure,
}) {
  const builders = {
    window_type: () => buildWindowTypeOption(totalBtu, areaSqm),
    wall_split: () => buildWallSplitOption(totalBtu, areaSqm, sunExposure),
    multi_split: () => buildMultiSplitOption(totalBtu, areaSqm, sunExposure),
    ceiling_cassette: () =>
      buildCeilingCassetteOption(totalBtu, areaSqm, sunExposure),
    floor_mounted: () => buildFloorMountedOption(totalBtu, areaSqm),
    packaged_unit: () => buildPackagedUnitOption(totalTR, areaSqm, roomType),
    vrf_vrv: () => buildVrfVrvOption(totalHp, totalTR, areaSqm, roomType),
    ducted_system: () => buildDuctedSystemOption(totalTR, areaSqm, roomType),
    centralized: () => buildCentralizedOption(totalTR),
    chilled_water: () => buildChilledWaterOption(totalTR),
  };

  /** @type {HvacSystemOption[]} */
  const options = [];
  for (const system of candidateSystems) {
    const builder = builders[system];
    if (builder) options.push(builder());
  }
  return options;
}

/**
 * Stage 6: contractor notes & site warnings tailored to the project.
 * @param {{ totalTR: number, totalHp: number, areaSqm: number, roomType: RoomType, sunExposure: SunExposure, occupancy: number, insulation: Insulation, scaleCategory: ScaleCategory }} ctx
 * @returns {string[]}
 */
export function generateContractorNotes({
  totalTR,
  areaSqm,
  roomType,
  sunExposure,
  occupancy,
  insulation,
  scaleCategory,
}) {
  const notes = [
    "Cooling load shown is a preliminary estimate, not a final engineered design.",
    "Sizing already includes a 15% engineering safety buffer for tropical Philippine peak conditions.",
    "Final equipment selection requires a site survey: glazing, roof exposure, infiltration, and operating schedule.",
    "Verify electrical service capacity, breaker sizing, and voltage compatibility with the proposed system.",
  ];

  if (totalTR >= 5) {
    notes.push(
      `For ${round1(totalTR)} TR and above, confirm ducting routes, static pressure, return-air paths, and ventilation balancing during detailed design.`,
    );
  }
  if (
    occupancy / areaSqm > 0.25 ||
    roomType === "restaurant" ||
    roomType === "classroom" ||
    roomType === "gym"
  ) {
    notes.push(
      "High occupancy density: provide a dedicated fresh-air system or DOAS sized to local code minimums.",
    );
  }
  if (sunExposure === "high" || sunExposure === "very_high") {
    notes.push(
      "Significant solar gain expected; consider solar film, brise-soleil, or perimeter-weighted unit placement.",
    );
  }
  if (insulation === "poor") {
    notes.push(
      "Poor insulation noted; upgrading roof/wall insulation will reduce both first cost and lifetime energy use of the HVAC system.",
    );
  }
  if (roomType === "server_room") {
    notes.push(
      "Server rooms require N+1 redundancy, 24/7 operation, and tighter humidity control than comfort cooling.",
    );
  }
  if (
    scaleCategory === "large_commercial" ||
    scaleCategory === "industrial_scale"
  ) {
    notes.push(
      "At this scale, engage a licensed mechanical engineer for full HVAC design, equipment specification, and PCAB-permitted installation.",
    );
  }
  return notes;
}

function generateWarnings(validated, totalBtu, totalTR) {
  const warnings = [];
  const density = validated.occupancy / validated.areaSqm;
  if (density > 0.35) {
    warnings.push(
      "High occupancy density detected; verify ventilation and fresh-air strategy.",
    );
  }
  if (
    validated.insulation === "poor" &&
    (validated.sunExposure === "high" || validated.sunExposure === "very_high")
  ) {
    warnings.push(
      "Poor insulation with strong sun exposure can significantly raise daytime peak load.",
    );
  }
  if (
    totalBtu > 36000 &&
    (validated.roomType === "bedroom" || validated.roomType === "living_room")
  ) {
    warnings.push(
      "Calculated load exceeds common residential single-zone range; consider zoning or multi-split design.",
    );
  }
  if (validated.roomType === "server_room") {
    warnings.push(
      "Server rooms require dedicated ventilation and continuous operation planning.",
    );
  }
  if (validated.areaSqm > 500) {
    warnings.push(
      "Very large area detected; professional HVAC design and duct/air-distribution study is recommended.",
    );
  }
  if (totalTR > 60) {
    warnings.push(
      "Industrial-scale cooling demand: chilled-water or central plant design required, beyond preliminary calculator scope.",
    );
  }
  return warnings;
}

/**
 * Main entry point: full pipeline from raw inputs to contractor-style proposal.
 * @param {AirconLoadInputs} rawInputs
 */
export function calculateAirconLoad(rawInputs) {
  const validated = validateInputs(rawInputs);

  // Stage 1
  const load = calculateCoolingLoad(validated);

  // Stage 2
  const classification = classifyProjectScale(load.totalTR, {
    roomType: validated.roomType,
    areaSqm: validated.areaSqm,
  });

  // Stage 3
  const candidates = determineSystemCategories(classification, {
    areaSqm: validated.areaSqm,
    roomType: validated.roomType,
    totalTR: load.totalTR,
  });

  // Stage 4
  const systemOptions = generateCommercialRecommendations({
    candidateSystems: candidates,
    totalTR: load.totalTR,
    totalHp: load.totalHp,
    totalBtu: load.totalBtu,
    areaSqm: validated.areaSqm,
    roomType: validated.roomType,
    sunExposure: validated.sunExposure,
    occupancy: validated.occupancy,
  });

  // Stage 5/6
  const contractorNotes = generateContractorNotes({
    totalTR: load.totalTR,
    totalHp: load.totalHp,
    areaSqm: validated.areaSqm,
    roomType: validated.roomType,
    sunExposure: validated.sunExposure,
    occupancy: validated.occupancy,
    insulation: validated.insulation,
    scaleCategory: classification.scaleCategory,
  });
  const warnings = generateWarnings(validated, load.totalBtu, load.totalTR);

  return {
    totalBtu: load.totalBtu,
    totalHp: load.totalHp,
    totalTR: load.totalTR,
    totalTons: load.totalTR,
    breakdown: load.breakdown,
    projectClassification: classification,
    recommendedSystemOptions: systemOptions,
    contractorNotes,
    warnings,
  };
}
