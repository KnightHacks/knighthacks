import type { RouteProps } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import { Redirect, Route } from "wouter";

export function AuthenticatedRoute(props: RouteProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <>Loading...</>;
  }

  if (!isSignedIn) {
    return <Redirect to="/signin" />;
  }

  return <Route {...props} />;
}
