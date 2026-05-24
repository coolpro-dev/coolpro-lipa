"use client";

import type { AirconLoadResult } from "@/lib/hvac-engine/types";

type Props = {
  load: AirconLoadResult;
};

function formatBtu(value: number): string {
  return `${Math.round(value).toLocaleString()} BTU/hr`;
}

export function ResultsPanel({ load }: Props) {
  const { bestMatch, alternativeOptions, explanationText } = load.recommendation;

  return (
    <div className="space-y-4" id="calc-results">
      <div className="rounded-xl bg-slate-100 p-4">
        <p className="text-xs uppercase tracking-wide text-muted">Cooling Requirement</p>
        <p className="display text-3xl font-bold text-brand-dark">{formatBtu(load.totalBtu)}</p>
        <p className="text-sm text-muted mt-1">
          Heat load only. Product type is ranked separately using your room use and preferences.
        </p>
      </div>

      <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="display font-semibold text-brand-dark">Best Match</h3>
            <p className="font-semibold mt-1 text-lg">{bestMatch.systemLabel}</p>
            <p className="text-sm text-muted">{bestMatch.capacityLabel}</p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-dark">
            {bestMatch.score}% fit
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm font-medium">Reason:</p>
          <ul className="mt-1 text-sm text-muted list-disc pl-5 space-y-1">
            {explanationText.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="display font-semibold text-brand-dark">Power Estimate</h3>
          <p className="display text-2xl font-bold mt-1">{bestMatch.estimatedMonthlyKwh} kWh/mo</p>
          <p className="text-sm text-muted mt-1">Estimated from capacity, system efficiency, and typical usage hours.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="display font-semibold text-brand-dark">Cooldown Performance</h3>
          <p className="text-sm text-muted mt-1">{bestMatch.cooldownPerformance}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="display font-semibold text-brand-dark">Alternative Options</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {alternativeOptions.map((option) => (
            <li key={option.systemId} className="flex items-start justify-between gap-3">
              <span>
                <span className="font-medium">{option.systemLabel}</span>
                <span className="block text-muted">{option.capacityLabel}</span>
              </span>
              <span className="text-xs rounded-full bg-slate-100 px-2 py-1 text-muted">
                {option.score}% fit
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="display font-semibold text-brand-dark">Room assessment</h3>
        <p className="text-sm mt-1">
          <strong>{load.projectClassification.scaleLabel}</strong> -{" "}
          {load.projectClassification.applicationType.replace("_", " ")} use (~{load.totalTR} TR).
        </p>
        {load.warnings.length > 0 && (
          <ul className="mt-2 text-sm text-amber-800 list-disc pl-5 space-y-1">
            {load.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
        <p className="text-xs text-muted mt-3">
          Confidence level: {load.heatLoad.confidenceScore}%. Includes a tropical safety buffer.
        </p>
      </div>

      <details className="rounded-xl border border-slate-200 p-4 bg-surface">
        <summary className="display font-semibold cursor-pointer">Calculation and recommendation trace</summary>
        <div className="mt-3 space-y-3">
          <div>
            <p className="text-sm font-medium">How BTU was derived</p>
            <ul className="mt-1 text-sm text-muted list-disc pl-5 space-y-1">
              {load.heatLoad.adjustmentBreakdown.trace.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Why recommendations ranked this way</p>
            <ul className="mt-1 text-sm text-muted list-disc pl-5 space-y-1">
              {load.recommendation.trace.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}
