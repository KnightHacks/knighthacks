import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@knighthacks/ui";
import { ThemeProvider } from "@knighthacks/ui/theme";
import { Toaster } from "@knighthacks/ui/toast";

import { env } from "~/env";
import { TRPCProvider } from "~/trpc/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NODE_ENV === "production"
      ? "https://2024.knighthacks.org"
      : "http://localhost:3000",
  ),
  title: "KnightHacks 2024",
  description: "The official website for KnightHacks 2024",
  openGraph: {
    title: "KnightHacks 2024",
    description: "The official website for KnightHacks 2024",
    url: "https://2024.knighthacks.org",
    siteName: "KnightHacks 2024",
  },
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={cn(
          "flex min-h-screen w-screen flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased",
          inter.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          disableTransitionOnChange
          enableSystem
        >
          <ClerkProvider
            appearance={{
              variables: {
                colorPrimary: "#2563eb",
              },
            }}
          >
            <TRPCProvider>
              {children}
              <Toaster />
            </TRPCProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
