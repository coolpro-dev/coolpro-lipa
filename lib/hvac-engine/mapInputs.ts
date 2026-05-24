import type {
  AirconLoadInputs,
  BudgetPreference,
  EnergyPreference,
  InstallationConstraints,
  Insulation,
  NoisePreference,
  RecommendationPreferences,
  RoomType,
  SunExposure,
} from "./types";

export const ROOM_TYPE_OPTIONS: Record<string, RoomType> = {
  Bedroom: "bedroom",
  "Living room": "living_room",
  Office: "office",
  "Commercial hall": "commercial_hall",
  Restaurant: "restaurant",
  "Server room": "server_room",
  Gym: "gym",
  Classroom: "classroom",
  "Retail store": "retail_store",
};

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  bedroom: "Bedroom",
  living_room: "Living room",
  office: "Office",
  commercial_hall: "Commercial hall",
  restaurant: "Restaurant",
  server_room: "Server room",
  gym: "Gym",
  classroom: "Classroom",
  retail_store: "Retail store",
};

export type CalculatorFormState = {
  lengthM: string;
  widthM: string;
  people: string;
  roomTypeLabel: string;
  sunLabel: "Normal" | "Very Sunny" | "Shaded";
  ceilingM: string;
  insulationLabel: "Good" | "Average" | "Poor";
  windows: string;
  electronics: string;
  hasKitchen: boolean;
  floorLevel?: string;
  windowOrientation?: string;
  budgetPreference: BudgetPreference;
  noisePreference: NoisePreference;
  energyPreference: EnergyPreference;
  installationConstraint: "standard" | "no_window_opening" | "no_outdoor_space" | "has_ceiling_space";
};

export function mapSunExposure(label: CalculatorFormState["sunLabel"]): SunExposure {
  switch (label) {
    case "Very Sunny":
      return "high";
    case "Shaded":
      return "none";
    default:
      return "medium";
  }
}

export function mapRoomType(label: string): RoomType {
  return ROOM_TYPE_OPTIONS[label] ?? "bedroom";
}

export function deriveWindowRatio(areaSqm: number, windows: number): "low" | "medium" | "high" {
  if (windows <= 0) return "low";
  const density = windows / areaSqm;
  if (density >= 0.12) return "high";
  if (density >= 0.06) return "medium";
  return "low";
}

export function mapInsulation(label: string): Insulation {
  return label.toLowerCase() as Insulation;
}

export function buildEngineInputs(form: CalculatorFormState): AirconLoadInputs {
  const length = parseFloat(form.lengthM);
  const width = parseFloat(form.widthM);
  const areaSqm = length * width;
  const people = parseInt(form.people, 10) || 1;
  const windows = parseInt(form.windows, 10) || 0;
  const electronics = parseInt(form.electronics, 10) || 0;
  const ceilingHeightM = parseFloat(form.ceilingM) || 2.7;

  return {
    areaSqm,
    ceilingHeightM,
    sunExposure: mapSunExposure(form.sunLabel),
    windowRatio: deriveWindowRatio(areaSqm, windows),
    occupancy: people,
    roomType: mapRoomType(form.roomTypeLabel),
    insulation: mapInsulation(form.insulationLabel),
    appliances: {
      computer: electronics,
      refrigerator: form.hasKitchen ? 1 : 0,
      microwave: form.hasKitchen ? 1 : 0,
    },
  };
}

export function buildRecommendationPreferences(
  form: CalculatorFormState,
): RecommendationPreferences {
  return {
    budget: form.budgetPreference,
    noise: form.noisePreference,
    energy: form.energyPreference,
  };
}

export function buildInstallationConstraints(
  form: CalculatorFormState,
): InstallationConstraints {
  return {
    hasWindowOpening: form.installationConstraint !== "no_window_opening",
    hasOutdoorSpace: form.installationConstraint !== "no_outdoor_space",
    hasCeilingSpace: form.installationConstraint === "has_ceiling_space",
  };
}
