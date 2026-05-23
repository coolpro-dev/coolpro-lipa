"use client";

import { site, messengerPrefill } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

type Summary = {
  hp: number;
  btu: number;
  roomType: string;
};

type Props = {
  summary?: Summary | null;
  onRequestQuote?: () => void;
  onBookVisit?: () => void;
};

function buildMessage(summary?: Summary | null): string {
  if (!summary) {
    return "Hi CoolPro! I'd like a quote for aircon service.";
  }
  return `Hi CoolPro! I used your AC calculator.
Recommended: ${summary.hp} HP (~${Math.round(summary.btu).toLocaleString()} BTU/hr)
Room type: ${summary.roomType}
Location: `;
}

export function CtaBar({ summary, onRequestQuote, onBookVisit }: Props) {
  const msg = buildMessage(summary);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <button
        type="button"
        onClick={() => {
          trackEvent("cta_click", { cta: "request_quote" });
          onRequestQuote?.();
        }}
        className="col-span-2 sm:col-span-1 px-3 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark"
      >
        Request Quote
      </button>
      <button
        type="button"
        onClick={() => {
          trackEvent("cta_click", { cta: "book_visit" });
          onBookVisit?.();
        }}
        className="col-span-2 sm:col-span-1 px-3 py-3 rounded-xl border-2 border-brand text-brand text-sm font-semibold hover:bg-brand/5"
      >
        Book Site Visit
      </button>
      <a
        href={messengerPrefill(msg)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("cta_click", { cta: "messenger" })}
        className="px-3 py-3 rounded-xl bg-[#0084ff] text-white text-sm font-semibold text-center"
      >
        Message on Facebook
      </a>
      <a
        href={`tel:${site.phone}`}
        onClick={() => trackEvent("cta_click", { cta: "call" })}
        className="px-3 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold text-center"
      >
        Call Now
      </a>
    </div>
  );
}
