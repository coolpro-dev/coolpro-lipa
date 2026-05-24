"use client";

import { ROOM_TYPE_OPTIONS } from "@/lib/hvac-engine/mapInputs";
import type { CalculatorFormState } from "@/lib/hvac-engine/mapInputs";

type Props = {
  form: CalculatorFormState;
  update: <K extends keyof CalculatorFormState>(key: K, value: CalculatorFormState[K]) => void;
};

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none";

export function CalculatorForm({ form, update }: Props) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="display text-lg font-semibold mb-1">Room basics</h2>
        <p className="text-sm text-muted mb-4">Enter room size in meters for an instant estimate.</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium">Length (m)</span>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="0.1"
              className={fieldClass}
              value={form.lengthM}
              onChange={(e) => update("lengthM", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Width (m)</span>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="0.1"
              className={fieldClass}
              value={form.widthM}
              onChange={(e) => update("widthM", e.target.value)}
            />
          </label>
        </div>
        <label className="block mt-3">
          <span className="text-sm font-medium">Number of people</span>
          <input
            type="number"
            min="1"
            className={fieldClass}
            value={form.people}
            onChange={(e) => update("people", e.target.value)}
          />
        </label>
        <label className="block mt-3">
          <span className="text-sm font-medium">Room type</span>
          <select
            className={fieldClass}
            value={form.roomTypeLabel}
            onChange={(e) => update("roomTypeLabel", e.target.value)}
          >
            {Object.keys(ROOM_TYPE_OPTIONS).map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted mt-1 block">
            Bedrooms need less cooling than gyms or restaurants.
          </span>
        </label>
        <fieldset className="mt-3">
          <legend className="text-sm font-medium mb-2">Sun exposure</legend>
          <div className="flex flex-wrap gap-2">
            {(["Normal", "Very Sunny", "Shaded"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => update("sunLabel", opt)}
                className={`px-3 py-2 rounded-full text-sm border ${
                  form.sunLabel === opt
                    ? "bg-brand text-white border-brand"
                    : "border-slate-300 hover:border-brand"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      <details className="rounded-xl border border-slate-200 p-4 bg-surface">
        <summary className="display font-semibold cursor-pointer">Advanced options</summary>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Ceiling height (m)</span>
            <input
              type="number"
              step="0.1"
              min="2"
              className={fieldClass}
              value={form.ceilingM}
              onChange={(e) => update("ceilingM", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Insulation</span>
            <select
              className={fieldClass}
              value={form.insulationLabel}
              onChange={(e) =>
                update("insulationLabel", e.target.value as CalculatorFormState["insulationLabel"])
              }
            >
              <option>Good</option>
              <option>Average</option>
              <option>Poor</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Number of windows</span>
            <input
              type="number"
              min="0"
              className={fieldClass}
              value={form.windows}
              onChange={(e) => update("windows", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Electronics (computers, etc.)</span>
            <input
              type="number"
              min="0"
              className={fieldClass}
              value={form.electronics}
              onChange={(e) => update("electronics", e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.hasKitchen}
              onChange={(e) => update("hasKitchen", e.target.checked)}
            />
            <span className="text-sm">Kitchen appliances (fridge + microwave)</span>
          </label>
        </div>
      </details>

      <section className="rounded-xl border border-slate-200 p-4 bg-surface">
        <h2 className="display font-semibold mb-1">Recommendation preferences</h2>
        <p className="text-sm text-muted mb-4">
          These do not change the cooling load. They only help rank compatible AC systems.
        </p>
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Budget priority</span>
            <select
              className={fieldClass}
              value={form.budgetPreference}
              onChange={(e) =>
                update("budgetPreference", e.target.value as CalculatorFormState["budgetPreference"])
              }
            >
              <option value="lowest_upfront">Lowest upfront cost</option>
              <option value="balanced">Balanced</option>
              <option value="premium_comfort">Premium comfort</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Noise preference</span>
            <select
              className={fieldClass}
              value={form.noisePreference}
              onChange={(e) =>
                update("noisePreference", e.target.value as CalculatorFormState["noisePreference"])
              }
            >
              <option value="standard">Standard</option>
              <option value="quiet">Quiet operation preferred</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Energy saving</span>
            <select
              className={fieldClass}
              value={form.energyPreference}
              onChange={(e) =>
                update("energyPreference", e.target.value as CalculatorFormState["energyPreference"])
              }
            >
              <option value="standard">Standard</option>
              <option value="important">Important</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Installation condition</span>
            <select
              className={fieldClass}
              value={form.installationConstraint}
              onChange={(e) =>
                update(
                  "installationConstraint",
                  e.target.value as CalculatorFormState["installationConstraint"],
                )
              }
            >
              <option value="standard">No major constraints</option>
              <option value="no_window_opening">No window opening / wall sleeve</option>
              <option value="no_outdoor_space">No outdoor condenser space</option>
              <option value="has_ceiling_space">Ceiling space available</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}
