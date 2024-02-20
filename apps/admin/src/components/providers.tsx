import { ClerkProviderWithTheme } from "./clerk-provider-with-theme";
import { TRPCProvider } from "./trpc-provider";
import { ThemeProvider } from "./ui/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClerkProviderWithTheme>
        <TRPCProvider>{children}</TRPCProvider>
      </ClerkProviderWithTheme>
    </ThemeProvider>
  );
}
