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
import { Auth0Provider } from "@auth0/auth0-react";

export function App() {
  return (
    <WithTrpc>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <Router />
      </Auth0Provider>
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
        <Route>404, Not Found!</Route>
      </Switch>
    </>
  );
}
