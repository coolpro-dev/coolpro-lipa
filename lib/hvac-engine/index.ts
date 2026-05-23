export type {
  AirconLoadInputs,
  AirconLoadResult,
  Insulation,
  RoomType,
  SunExposure,
  WindowRatio,
} from "./types";

export {
  calculateAirconLoad,
  calculateCoolingLoad,
  validateInputs,
} from "./calculator-core.js";

export {
  buildEngineInputs,
  deriveWindowRatio,
  mapRoomType,
  mapSunExposure,
  type CalculatorFormState,
} from "./mapInputs";

export { getSizingAdvice, type SizingAdvice } from "./sizingAdvice";
