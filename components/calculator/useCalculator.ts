"use client";

import { useMemo, useState } from "react";
import { calculateAirconLoad } from "@/lib/hvac-engine/airconLoadEngine";
import {
  buildInstallationConstraints,
  buildEngineInputs,
  buildRecommendationPreferences,
  type CalculatorFormState,
} from "@/lib/hvac-engine/mapInputs";
import { trackEvent } from "@/lib/analytics";

const defaultForm: CalculatorFormState = {
  lengthM: "4",
  widthM: "5",
  people: "2",
  roomTypeLabel: "Bedroom",
  sunLabel: "Normal",
  ceilingM: "2.7",
  insulationLabel: "Average",
  windows: "1",
  electronics: "0",
  hasKitchen: false,
  budgetPreference: "balanced",
  noisePreference: "quiet",
  energyPreference: "important",
  installationConstraint: "standard",
};

export function useCalculator() {
  const [form, setForm] = useState<CalculatorFormState>(defaultForm);
  const [started, setStarted] = useState(false);

  const update = <K extends keyof CalculatorFormState>(
    key: K,
    value: CalculatorFormState[K],
  ) => {
    if (!started) {
      setStarted(true);
      trackEvent("calculator_started");
    }
    setForm((f) => ({ ...f, [key]: value }));
  };

  const result = useMemo(() => {
    const length = parseFloat(form.lengthM);
    const width = parseFloat(form.widthM);
    if (!length || !width || length <= 0 || width <= 0) return null;

    try {
      const inputs = buildEngineInputs(form);
      const preferences = buildRecommendationPreferences(form);
      const installationConstraints = buildInstallationConstraints(form);
      const load = calculateAirconLoad(inputs, {
        preferences,
        installationConstraints,
      });
      return {
        inputs,
        preferences,
        installationConstraints,
        load,
        primary: load.recommendation.bestMatch,
      };
    } catch {
      return null;
    }
  }, [form]);

  return { form, update, result, setForm };
}
