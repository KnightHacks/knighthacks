import { Route, Switch } from "wouter";

import { AdminRoute } from "~/components/admin-route";
import { AuthenticatedRoute } from "~/components/authenticated-route";
import { WithNav } from "~/components/with-nav.jsx";
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
      <AdminRoute path="/" component={WithNav(Overview)} />
      <AdminRoute path="/users" component={WithNav(Users)} />
      <Route path="/hello" component={WithNav(Hello)} />
      <Route path="/signin" component={SignIn} />
      <Route path="/hackathon/signin" component={WithNav(HackathonSignIn)} />
      <AuthenticatedRoute
        path="/hackathon/account-registration"
        component={WithNav(HackathonAccountRegistration)}
      />
      <AuthenticatedRoute
        path="/hackathon/registration"
        component={WithNav(HackathonRegistration)}
      />
      <Route>404, Not Found!</Route>
    </Switch>
  );
}
