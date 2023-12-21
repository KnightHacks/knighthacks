import { ClerkProvider } from "@clerk/clerk-react";

import { TRPCProvider } from "./trpc-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
    >
      <TRPCProvider>{children}</TRPCProvider>
    </ClerkProvider>
  );
}
