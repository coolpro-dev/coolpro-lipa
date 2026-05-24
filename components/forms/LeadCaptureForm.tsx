"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { AirconLoadInputs } from "@/lib/hvac-engine/types";

type Props = {
  calculationInputs: AirconLoadInputs;
  calculationResult: {
    totalBtu: number;
    totalHp: number;
    totalTR: number;
    warnings?: string[];
    bestMatch?: string;
    alternatives?: string[];
  };
  roomMeta: {
    roomLengthM: number;
    roomWidthM: number;
    ceilingHeightM: number;
    roomType: string;
    insulation: string;
    sunExposure: string;
    windowCount: number;
    floorLevel?: string;
    windowOrientation?: string;
  };
  emphasizeSchedule?: boolean;
};

function generateFormToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return btoa(`${timestamp}:${random}`);
}

function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function LeadCaptureForm({
  calculationInputs,
  calculationResult,
  roomMeta,
  emphasizeSchedule = false,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [formToken, setFormToken] = useState<string>("");
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    setFormToken(generateFormToken());
    setIdempotencyKey(generateIdempotencyKey());
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);

    const honeypotValue = fd.get("website") as string;
    if (honeypotValue) {
      setErrorMsg("Submission blocked.");
      setStatus("error");
      return;
    }

    const turnstileToken =
      (fd.get("cf-turnstile-response") as string) ||
      (document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement)?.value;

    const payload = {
      name: fd.get("name"),
      mobile: fd.get("mobile"),
      email: fd.get("email") || undefined,
      address: fd.get("address"),
      preferredSchedule: fd.get("preferredSchedule") || undefined,
      notes: fd.get("notes") || undefined,
      existingAcUnit: fd.get("existingAcUnit") || undefined,
      floorLevel: fd.get("floorLevel") || undefined,
      windowOrientation: fd.get("windowOrientation") || undefined,
      ...roomMeta,
      calculationInputs,
      calculationResult,
      sourcePage: "/calculator",
      turnstileToken: turnstileToken || undefined,
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
      userAgent: navigator.userAgent.slice(0, 500),
      _hp: honeypotValue || undefined,
      _ft: formToken || undefined,
      _ik: idempotencyKey || undefined,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErrorMsg(data.error ?? "Submission failed.");
        setStatus("error");
        return;
      }
      trackEvent("lead_submitted");
      setStatus("success");
      formRef.current?.reset();
    } catch {
      setErrorMsg("Network error. Please try Messenger or call us.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
        <p className="display font-semibold text-emerald-900">Thank you!</p>
        <p className="text-sm text-emerald-800 mt-2">
          We received your inquiry and will contact you soon. You can also message us on Messenger for faster replies.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4" id="lead-form">
      <h2 className="display text-xl font-bold">Get your quote</h2>
      <p className="text-sm text-muted">
        We&apos;ll use your calculation results — no need to re-enter HP or room size.
      </p>

      {/* Honeypot field - hidden from users, visible to bots */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <label htmlFor="website">Leave this field empty</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="block">
        <span className="text-sm font-medium">Name *</span>
        <input name="name" required className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Mobile *</span>
        <input name="mobile" type="tel" required placeholder="09XX XXX XXXX" className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Email (optional)</span>
        <input name="email" type="email" className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Address / location *</span>
        <input name="address" required placeholder="Barangay, city" className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">
          Preferred schedule {emphasizeSchedule ? "*" : "(optional)"}
        </span>
        <input
          name="preferredSchedule"
          className={inputClass}
          placeholder="e.g. Weekday morning"
          required={emphasizeSchedule}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Existing AC unit (optional)</span>
        <input name="existingAcUnit" className={inputClass} placeholder="Brand, HP, type" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Notes (optional)</span>
        <textarea name="notes" rows={3} className={inputClass} />
      </label>

      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-muted">
        Photo upload — coming soon. Send photos via Messenger for now.
      </div>

      {turnstileSiteKey && (
        <div
          className="cf-turnstile"
          data-sitekey={turnstileSiteKey}
          data-theme="light"
        />
      )}

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Submit inquiry"}
      </button>
    </form>
  );
}
