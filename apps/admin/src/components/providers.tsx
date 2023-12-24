import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

import { TRPCProvider } from "./trpc-provider";
import { ThemeProvider } from "./ui/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
      >
        <TRPCProvider>{children}</TRPCProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
