import { useAuth0 } from "@auth0/auth0-react";
import { Redirect } from "wouter";

export function SignIn() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  if (isLoading) return <div>Loading...</div>;

  // Redirect to home if the user is authenticated
  if (isAuthenticated) return <Redirect to="/" />;

  return <button onClick={() => loginWithRedirect()}>Sign In</button>;
}
