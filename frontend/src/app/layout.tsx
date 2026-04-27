import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const font = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VIRAIL | AI Video Shorts Creator",
  description: "Turn long videos into viral shorts automatically with premium AI.",
  icons: {
    icon: "/favicon.png",
  },
};

import { PostHogProvider } from "@/providers/posthog-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${font.className} bg-background text-foreground antialiased selection:bg-blue-500/30`}>
          {/* Global Grain Overlay */}
          <div className="grain-overlay" />
          
          <PostHogProvider>
            {children}
          </PostHogProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}
