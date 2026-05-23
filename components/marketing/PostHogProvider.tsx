"use client";

import { useEffect } from "react";

export function PostHogProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key) return;

    void import("posthog-js").then((posthog) => {
      posthog.default.init(key, {
        api_host: host ?? "https://us.i.posthog.com",
        capture_pageview: true,
      });
    });
  }, []);

  return null;
}
