import type { RouteProps } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute(props: RouteProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <>Loading...</>;
  }

  if (!isSignedIn) {
    return <Redirect to="/hackathon/signin" />;
  }

  return <Route {...props} />;
}
