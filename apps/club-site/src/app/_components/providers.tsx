"use client";

import { ThemeProvider } from "@knighthacks/ui/theme";

import { TRPCProvider } from "~/trpc";
import { ClerkProviderWithTheme } from "./clerk-provider-with-theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <ClerkProviderWithTheme>
        <TRPCProvider>{children}</TRPCProvider>
      </ClerkProviderWithTheme>
    </ThemeProvider>
  );
}
