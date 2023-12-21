import { ClerkProvider } from "@clerk/clerk-react";
import { Route, Switch } from "wouter";

import { ProtectedRoute } from "./lib/components/protected-route";
import { TRPCProvider } from "./lib/components/trpc-provider";
import { WithNav } from "./lib/components/with-nav";
import { HackathonAccountRegistration } from "./pages/hackathon-account-registration.tsx";
import { HackathonRegistration } from "./pages/hackathon-registration";
import { HackathonSignIn } from "./pages/hackathon-signin";
import { Hello } from "./pages/hello";
import { Overview } from "./pages/overview";
import { SignIn } from "./pages/sign-in";
import { Users } from "./pages/users";

export function App() {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
    >
      <TRPCProvider>
        <Router />
      </TRPCProvider>
    </ClerkProvider>
  );
}

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/hello" component={WithNav(Hello)} />
      <ProtectedRoute path="/" component={WithNav(Overview)} />
      <ProtectedRoute path="/users" component={WithNav(Users)} />
      <Route path="/signin" component={SignIn} />
      <Route path="/hackathon/signin" component={WithNav(HackathonSignIn)} />
      <ProtectedRoute
        path="/hackathon/account-registration"
        component={WithNav(HackathonAccountRegistration)}
      />
      <ProtectedRoute
        path="/hackathon/registration"
        component={WithNav(HackathonRegistration)}
      />
      <Route>404, Not Found!</Route>
    </Switch>
  );
}
