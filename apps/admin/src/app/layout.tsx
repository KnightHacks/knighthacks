import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./_components/providers";

import "./globals.css";

import { cn } from "@knighthacks/ui";
import { ThemeToggle } from "@knighthacks/ui/theme";
import { Toaster } from "@knighthacks/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://admin.knighthacks.org"
      : "http://localhost:3000",
  ),
  title: "KnightHacks Admin Tool",
  description: "The official KnightHacks admin tool",
  openGraph: {
    title: "KnightHacks Admin Tool",
    description: "The official KnightHacks admin tool",
    url: "https://admin.knighthacks.org",
    siteName: "KnightHacks Admin",
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
