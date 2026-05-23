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

export type AirconLoadResult = {
  totalBtu: number;
  totalHp: number;
  totalTR: number;
  totalTons: number;
  breakdown: Record<string, unknown>;
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
  }>;
  contractorNotes: string[];
  warnings: string[];
};
