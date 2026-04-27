"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize in the browser
    if (typeof window !== "undefined" && !posthog.__loaded) {
      const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      if (phKey && phKey !== "ph_mock_key") {
        posthog.init(phKey, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
          capture_pageview: false,
        });
      }
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
