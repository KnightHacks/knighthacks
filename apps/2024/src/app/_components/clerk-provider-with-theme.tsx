"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function ClerkProviderWithTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "#2563eb",
        },
        elements: {
          card: "bg-background border border-input",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          dividerText: "text-muted-foreground",
          dividerLine: "bg-muted",
          socialButtonsIconButton:
            "bg-background border border-input text-foreground focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:transition-none dark:hover:bg-slate-900 hover:bg-slate-100 focus:ring-ring",
          formFieldInput:
            "bg-background rounded-md text-foreground border border-input placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:transition-none focus-visible:ring-ring",
          formButtonPrimary:
            "bg-primary text-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:transition-none hover:bg-primary/90 focus-visible:ring-ring",
          formFieldLabel: "text-foreground",
          footerActionLink:
            "text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:transition-none focus-visible:ring-ring",
          footerActionText: "text-muted-foreground",
        },
      }}
      signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_2024_AFTER_SIGN_IN_URL}
      signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_2024_AFTER_SIGN_UP_URL}
      signUpUrl={process.env.NEXT_PUBLIC_2024_SIGN_UP_URL}
      signInUrl={process.env.NEXT_PUBLIC_2024_SIGN_IN_URL}
    >
      {children}
    </ClerkProvider>
  );
}
