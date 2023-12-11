import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "./trpc";
import { Route, Switch } from "wouter";
import { Hello } from "./pages/Hello";
import { Overview } from "./pages/Overview";
import { Nav } from "./components/Nav";
import { ClerkProvider } from "@clerk/clerk-react";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { dark } from "@clerk/themes";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing Publishable Key");
}

export function App() {
  return (
    <WithTrpc>
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        appearance={{
          baseTheme: dark,
        }}
      >
        <Router />
      </ClerkProvider>
    </WithTrpc>
  );
}

function WithTrpc({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

function Router() {
  return (
    <>
      <Nav />
      <Switch>
        <Route path="/hello" component={Hello} />
        <Route path="/" component={Overview} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route>404, Not Found!</Route>
      </Switch>
    </>
  );
}
