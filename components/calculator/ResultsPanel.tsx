"use client";

import type { SizingAdvice } from "@/lib/hvac-engine/sizingAdvice";

type LoadResult = {
  totalBtu: number;
  totalHp: number;
  totalTR: number;
  projectClassification: { scaleLabel: string; applicationType: string };
  warnings: string[];
  contractorNotes: string[];
  recommendedSystemOptions: Array<{ systemLabel: string; recommendedUseCase: string }>;
};

type Props = {
  load: LoadResult;
  sizing: SizingAdvice;
  primary?: { systemLabel: string; recommendedUseCase: string };
};

export function ResultsPanel({ load, sizing, primary }: Props) {
  const sizingColors = {
    ok: "bg-emerald-50 text-emerald-800 border-emerald-200",
    undersized: "bg-amber-50 text-amber-900 border-amber-200",
    oversized: "bg-orange-50 text-orange-900 border-orange-200",
  };

  return (
    <div className="space-y-4" id="calc-results">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-brand text-white p-4 text-center">
          <p className="text-xs uppercase tracking-wide opacity-80">Recommended</p>
          <p className="display text-3xl font-bold">{load.totalHp} HP</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted">Estimated load</p>
          <p className="display text-2xl font-bold text-brand-dark">
            {Math.round(load.totalBtu).toLocaleString()}
          </p>
          <p className="text-xs text-muted">BTU/hr</p>
        </div>
      </div>

      <div className={`rounded-lg border p-3 text-sm ${sizingColors[sizing.status]}`}>
        <p className="font-semibold capitalize">{sizing.status === "ok" ? "Sizing check" : sizing.status}</p>
        <p className="mt-1">{sizing.message}</p>
      </div>

      {primary && (
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="display font-semibold text-brand-dark">Suggested AC type</h3>
          <p className="font-medium mt-1">{primary.systemLabel}</p>
          <p className="text-sm text-muted mt-1">{primary.recommendedUseCase}</p>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="display font-semibold text-brand-dark">Room assessment</h3>
        <p className="text-sm mt-1">
          <strong>{load.projectClassification.scaleLabel}</strong> —{" "}
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
          Includes 15% safety buffer. Final sizing requires an on-site survey.
        </p>
      </div>
    </div>
  );
}
