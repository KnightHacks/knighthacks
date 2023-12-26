import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

import { useTheme } from "./ui/theme-provider";

export function ClerkProviderWithTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
    >
      {children}
    </ClerkProvider>
  );
}
