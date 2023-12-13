import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "./trpc";
import { Route, Switch } from "wouter";
import { Hello } from "./pages/Hello";
import { Overview } from "./pages/Overview";
import { Nav } from "./components/Nav";
import { SignIn } from "./pages/SignIn";
import { Users } from "./pages/Users";

export function App() {
  return (
    <WithTrpc>
      <Router />
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
          url: `${import.meta.env.VITE_API_URL}/trpc`,
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
        <Route path="/users" component={Users} />
        <Route>404, Not Found!</Route>
      </Switch>
    </>
  );
}
