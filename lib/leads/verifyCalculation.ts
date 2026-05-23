import { calculateAirconLoad } from "@/lib/hvac-engine/calculator-core.js";
import type { AirconLoadInputs } from "@/lib/hvac-engine/types";

const TOLERANCE = 0.02;

export function verifyCalculationIntegrity(
  inputs: AirconLoadInputs,
  claimed: { totalBtu: number; totalHp: number },
): boolean {
  try {
    const fresh = calculateAirconLoad(inputs);
    const btuOk =
      Math.abs(fresh.totalBtu - claimed.totalBtu) / Math.max(claimed.totalBtu, 1) <=
      TOLERANCE;
    const hpOk =
      Math.abs(fresh.totalHp - claimed.totalHp) / Math.max(claimed.totalHp, 1) <=
      TOLERANCE;
    return btuOk && hpOk;
  } catch {
    return false;
  }
}
