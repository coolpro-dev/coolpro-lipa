export type SunExposure = "none" | "low" | "medium" | "high" | "very_high";
export type WindowRatio = "low" | "medium" | "high";
export type Insulation = "poor" | "average" | "good";
export type RoomType =
  | "bedroom"
  | "living_room"
  | "office"
  | "commercial_hall"
  | "restaurant"
  | "server_room"
  | "gym"
  | "classroom"
  | "retail_store";

export type ApplianceInputs = {
  tv?: number;
  computer?: number;
  refrigerator?: number;
  microwave?: number;
  lightingWatts?: number;
  otherWatts?: number;
};

export type AirconLoadInputs = {
  areaSqm: number;
  ceilingHeightM?: number;
  sunExposure?: SunExposure;
  windowRatio?: WindowRatio;
  occupancy?: number;
  roomType?: RoomType;
  insulation?: Insulation;
  appliances?: ApplianceInputs;
};

export type HeatLoadAdjustment = {
  key: string;
  label: string;
  value: number;
  effectBtu: number;
  explanation: string;
};

export type HeatLoadResult = {
  requiredBtu: number;
  confidenceScore: number;
  adjustmentBreakdown: {
    baseBtu: number;
    occupancyBtu: number;
    applianceBtu: number;
    subtotalBtu: number;
    multipliers: Record<string, number>;
    safetyBuffer: number;
    adjustments: HeatLoadAdjustment[];
    trace: string[];
  };
};

export type BudgetPreference = "lowest_upfront" | "balanced" | "premium_comfort";
export type NoisePreference = "standard" | "quiet";
export type EnergyPreference = "standard" | "important";

export type RecommendationPreferences = {
  budget: BudgetPreference;
  noise: NoisePreference;
  energy: EnergyPreference;
};

export type InstallationConstraints = {
  hasWindowOpening?: boolean;
  hasOutdoorSpace?: boolean;
  hasCeilingSpace?: boolean;
};

export type RecommendationSystemId =
  | "window_type"
  | "standard_split"
  | "split_inverter"
  | "ceiling_cassette"
  | "multi_split"
  | "packaged_unit";

export type AcSystemRecommendation = {
  systemId: RecommendationSystemId;
  systemLabel: string;
  capacityLabel: string;
  hp: number;
  capacityBtu: number;
  score: number;
  rankReasons: string[];
  cautions: string[];
  estimatedMonthlyKwh: number;
  cooldownPerformance: string;
  sizingStatus: "ok" | "undersized" | "oversized";
};

export type RecommendationResult = {
  possibleSystems: AcSystemRecommendation[];
  rankedRecommendations: AcSystemRecommendation[];
  bestMatch: AcSystemRecommendation;
  alternativeOptions: AcSystemRecommendation[];
  explanationText: string[];
  oversizeWarning?: string;
  undersizeWarning?: string;
  trace: string[];
};

export type AirconLoadResult = {
  totalBtu: number;
  totalHp: number;
  totalTR: number;
  totalTons: number;
  breakdown: Record<string, unknown>;
  heatLoad: HeatLoadResult;
  recommendation: RecommendationResult;
  projectClassification: {
    scaleCategory: string;
    scaleLabel: string;
    estimatedTR: number;
    applicationType: string;
  };
  recommendedSystemOptions: Array<{
    systemType: string;
    systemLabel: string;
    recommendedUseCase: string;
    hp?: number;
    score?: number;
  }>;
  contractorNotes: string[];
  warnings: string[];
  validationWarnings: string[];
};
