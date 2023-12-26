import type { RouteProps } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import { Redirect, Route } from "wouter";

import { LoadingOverlay } from "./loading-overlay";

export function AuthenticatedRoute(props: RouteProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoadingOverlay />;
  }

  if (!isSignedIn) {
    return <Redirect to="/signin" />;
  }

  return <Route {...props} />;
}
