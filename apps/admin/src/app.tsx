import { ClerkProvider } from "@clerk/clerk-react";

import { TRPCProvider } from "./components/trpc-provider";
import { Pages } from "./pages";

export function App() {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
    >
      <TRPCProvider>
        <Pages />
      </TRPCProvider>
    </ClerkProvider>
  );
}
