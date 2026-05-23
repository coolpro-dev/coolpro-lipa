"use client";

type EventName =
  | "calculator_started"
  | "calculation_completed"
  | "lead_submitted"
  | "cta_click";

export function trackEvent(name: EventName, properties?: Record<string, string | number>) {
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (key && typeof window !== "undefined") {
    void import("posthog-js").then((posthog) => {
      posthog.default.capture(name, properties);
    });
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, properties);
  }
}
