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
    <TRPCProvider>
      <Router />
    </TRPCProvider>
  );
}

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/hello" component={WithNav(Hello)} />
      <ProtectedRoute path="/" component={WithNav(Overview)} />
      <ProtectedRoute path="/users" component={WithNav(Users)} />
      <Route path="/signin" component={SignIn} />
      <Route path="/hackathon/signin" component={HackathonSignIn} />
      <Route
        path="/hackathon/account-registration"
        component={HackathonAccountRegistration}
      />
      <Route path="/hackathon/registration" component={HackathonRegistration} />
      <Route>404, Not Found!</Route>
    </Switch>
  );
}
