import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { cn } from "@knighthacks/ui";
import { ThemeToggle } from "@knighthacks/ui/theme";
import { Toaster } from "@knighthacks/ui/toast";

import { env } from "~/env";
import { Providers } from "./_components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NODE_ENV === "production"
      ? "https://club.knighthacks.org"
      : "http://localhost:3000",
  ),
  title: "KnightHacks",
  description: "The official club website for KnightHacks",
  openGraph: {
    title: "Knighthacks 2024",
    description: "The official club website for KnightHacks",
    url: "https://club.knighthacks.org",
    siteName: "KnightHacks",
  },
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.className,
        )}
      >
        <Providers>
          {children}
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
