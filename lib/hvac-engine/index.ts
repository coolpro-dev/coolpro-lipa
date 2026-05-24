export type {
  AcSystemRecommendation,
  AirconLoadInputs,
  AirconLoadResult,
  BudgetPreference,
  EnergyPreference,
  HeatLoadResult,
  InstallationConstraints,
  Insulation,
  NoisePreference,
  RecommendationPreferences,
  RecommendationResult,
  RoomType,
  SunExposure,
  WindowRatio,
} from "./types";

export { calculateAirconLoad } from "./airconLoadEngine";
export { calculateHeatLoad, validateHeatLoadInputs } from "./heatLoadEngine";
export { recommendAcSystems } from "./recommendationEngine";
export { hvacConfig } from "./config";

export {
  buildInstallationConstraints,
  buildEngineInputs,
  buildRecommendationPreferences,
  deriveWindowRatio,
  mapRoomType,
  mapSunExposure,
  type CalculatorFormState,
} from "./mapInputs";

export { getSizingAdvice, type SizingAdvice } from "./sizingAdvice";
