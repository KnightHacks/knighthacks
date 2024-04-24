"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkProviderWithTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
