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
      afterSignInUrl={import.meta.env.VITE_ADMIN_AFTER_SIGN_IN_URL as string}
      afterSignUpUrl={import.meta.env.VITE_ADMIN_AFTER_SIGN_UP_URL as string}
      signInUrl={import.meta.env.VITE_ADMIN_SIGN_IN_URL as string}
      signUpUrl={import.meta.env.VITE_ADMIN_SIGN_UP_URL as string}
    >
      {children}
    </ClerkProvider>
  );
}
