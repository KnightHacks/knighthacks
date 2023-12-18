import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useEffect, useState } from "react";
import superjson from "superjson";
import { trpc } from "./lib/trpc.ts";
import { Route, Switch } from "wouter";
import { Hello } from "./pages/Hello";
import { Overview } from "./pages/Overview";
import { Users } from "./pages/Users";
import { SignIn } from "./pages/SignIn";
import { ProtectedRoute } from "./lib/components/ProtectedRoute";
import { WithNav } from "./lib/components/WithNav";
import { HackathonRegistrationFlow } from "./pages/HackathonRegistrationFlow";
import { supabase } from "./lib/supabase.ts";
import { useSessionStore } from "./lib/stores/session-store.ts";

export function App() {
  const { session, setSession } = useSessionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <TRPCProvider accessToken={session?.access_token}>
      <Router />
    </TRPCProvider>
  );
}

function TRPCProvider({
  children,
  accessToken,
}: {
  children: React.ReactNode;
  accessToken?: string;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${import.meta.env.VITE_API_URL}/trpc`,
          headers() {
            if (!accessToken) {
              return {};
            }

            return {
              Authorization: `Bearer ${accessToken}`,
            };
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
      <Route
        path="/hackathon-registration-flow"
        component={HackathonRegistrationFlow}
      />
      <Route>404, Not Found!</Route>
    </Switch>
  );
}
