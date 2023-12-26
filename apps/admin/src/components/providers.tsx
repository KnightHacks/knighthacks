import { ClerkProviderWithTheme } from "./clerk-provider";
import { TRPCProvider } from "./trpc-provider";
import { ThemeProvider } from "./ui/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <ClerkProviderWithTheme>
        <TRPCProvider>{children}</TRPCProvider>
      </ClerkProviderWithTheme>
    </ThemeProvider>
  );
}
