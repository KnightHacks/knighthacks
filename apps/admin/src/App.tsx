import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "./trpc";
import { Route, Switch } from "wouter";
import { Hello } from "./pages/Hello";
import { Overview } from "./pages/Overview";
import { Users } from "./pages/Users";
import { SessionProvider, accessToken } from "./lib/hooks/useSession";
import { Nav } from "./components/Nav";
import { SignIn } from "./pages/SignIn";

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
          fetch(url, options) {
            return fetch(url, {
              ...options,
              headers: {
                ...options?.headers,
                Authorization: accessToken ? `Bearer ${accessToken}` : "",
              },
            });
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

function WithNav(component: () => JSX.Element) {
  return () => {
    return (
      <>
        <Nav />
        {component()}
      </>
    );
  };
}

function Router() {
  return (
    <Switch>
      <Route path="/hello" component={WithNav(Hello)} />
      <Route path="/" component={WithNav(Overview)} />
      <Route path="/users" component={WithNav(Users)} />
      <Route path="/signin" component={SignIn} />
      <Route>404, Not Found!</Route>
    </Switch>
  );
}
