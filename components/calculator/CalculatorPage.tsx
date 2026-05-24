"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { CalculatorForm } from "./CalculatorForm";
import { ResultsPanel } from "./ResultsPanel";
import { useCalculator } from "./useCalculator";
import { CtaBar } from "@/components/forms/CtaBar";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { trackEvent } from "@/lib/analytics";
import { mapSunExposure } from "@/lib/hvac-engine/mapInputs";

export function CalculatorPage() {
  const { form, update, result } = useCalculator();
  const [emphasizeSchedule, setEmphasizeSchedule] = useState(false);
  const trackedCalc = useRef(false);

  useEffect(() => {
    if (result && !trackedCalc.current) {
      trackedCalc.current = true;
      trackEvent("calculation_completed", { hp: result.load.totalHp });
    }
  }, [result]);

  const scrollToLead = useCallback((bookVisit = false) => {
    setEmphasizeSchedule(bookVisit);
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const summary = result
    ? {
        hp: result.load.recommendation.bestMatch.hp,
        btu: result.load.totalBtu,
        roomType: form.roomTypeLabel,
      }
    : null;

  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <>
      {turnstileKey && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <header className="mb-8">
          <h1 className="display text-3xl md:text-4xl font-bold text-brand-dark">
            AC Size Calculator
          </h1>
          <p className="text-muted mt-2 max-w-2xl">
            Find the right HP and BTU/hr for your room in Lipa and Batangas. Results update instantly
            as you change inputs.
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
          <div className="lg:sticky lg:top-20">
            <CalculatorForm form={form} update={update} />
          </div>

          <div className="mt-8 lg:mt-0 space-y-6">
            {result ? (
              <>
                <ResultsPanel
                  load={result.load}
                />
                <CtaBar
                  summary={summary}
                  onRequestQuote={() => scrollToLead(false)}
                  onBookVisit={() => scrollToLead(true)}
                />
                <LeadCaptureForm
                  calculationInputs={result.inputs}
                  calculationResult={{
                    totalBtu: result.load.totalBtu,
                    totalHp: result.load.totalHp,
                    totalTR: result.load.totalTR,
                    warnings: result.load.warnings,
                    bestMatch: result.load.recommendation.bestMatch.systemLabel,
                    alternatives: result.load.recommendation.alternativeOptions.map(
                      (option) => option.systemLabel,
                    ),
                  }}
                  roomMeta={{
                    roomLengthM: parseFloat(form.lengthM),
                    roomWidthM: parseFloat(form.widthM),
                    ceilingHeightM: parseFloat(form.ceilingM) || 2.7,
                    roomType: form.roomTypeLabel,
                    insulation: form.insulationLabel.toLowerCase(),
                    sunExposure: mapSunExposure(form.sunLabel),
                    windowCount: parseInt(form.windows, 10) || 0,
                    floorLevel: form.floorLevel,
                    windowOrientation: form.windowOrientation,
                  }}
                  emphasizeSchedule={emphasizeSchedule}
                />
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-muted">
                Enter valid room length and width to see your recommended AC size.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
