import { Route, Switch } from "wouter";

import { ProtectedRoute } from "~/components/protected-route";
import { WithNav } from "../components/with-nav";
import { HackathonAccountRegistration } from "./hackathon-account-registration.tsx";
import { HackathonRegistration } from "./hackathon-registration";
import { HackathonSignIn } from "./hackathon-signin";
import { Hello } from "./hello";
import { Overview } from "./overview";
import { SignIn } from "./sign-in";
import { Users } from "./users";

export function Pages() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={WithNav(Overview)} />
      <Route path="/hello" component={WithNav(Hello)} />
      <Route path="/signin" component={SignIn} />
      <ProtectedRoute path="/users" component={WithNav(Users)} />
      <Route path="/hackathon/signin" component={WithNav(HackathonSignIn)} />
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
