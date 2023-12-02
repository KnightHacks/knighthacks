import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "./trpc";
import { Route } from "wouter";
import { Hello } from "./pages/Hello";
import { Home } from "./pages/Home";
import { Nav } from "./components/Nav";

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
      <Route path="/hello" component={Hello} />
      <Route path="/" component={Home} />
    </>
  );
}
