import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { Route, Switch } from "wouter";

import { ProtectedRoute } from "./lib/components/protected-route";
import { WithNav } from "./lib/components/with-nav";
import { useSessionStore } from "./lib/stores/session-store";
import { supabase } from "./lib/supabase";
import { trpc } from "./lib/trpc";
import { HackathonRegistrationFlow } from "./pages/hackathon-registration-flow";
import { Hello } from "./pages/hello";
import { Overview } from "./pages/overview";
import { SignIn } from "./pages/sign-in";
import { Users } from "./pages/users";

export function App() {
  const { session, setSession } = useSessionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session) {
          setSession(session);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? undefined);
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
    }),
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
        component={WithNav(HackathonRegistrationFlow)}
      />
      <Route>404, Not Found!</Route>
    </Switch>
  );
}
