import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "./trpc";
import { Route, Switch } from "wouter";
import { Hello } from "./pages/Hello";
import { Overview } from "./pages/Overview";
import { Users } from "./pages/Users";
import { SignIn } from "./pages/SignIn";
import { supabase } from "./lib/supabase";
import { SessionProvider } from "./lib/contexts/session";
import { ProtectedRoute } from "./lib/components/ProtectedRoute";
import { WithNav } from "./lib/components/WithNav";

export function App() {
  return (
    <SessionProvider>
      <WithTrpc>
        <Router />
      </WithTrpc>
    </SessionProvider>
  );
}

function WithTrpc({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${import.meta.env.VITE_API_URL}/trpc`,
          async headers() {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            const accessToken = session?.access_token;
            return {
              ...(accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
            };
          },
          async fetch(input, init) {
            const res = await fetch(input, init);
            if (res.status === 401) {
              window.location.href = "/signin";
            }
            return res;
          },
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
    <Switch>
      <ProtectedRoute path="/hello" component={WithNav(Hello)} />
      <ProtectedRoute path="/" component={WithNav(Overview)} />
      <ProtectedRoute path="/users" component={WithNav(Users)} />
      <Route path="/signin" component={SignIn} />
      <Route>404, Not Found!</Route>
    </Switch>
  );
}
