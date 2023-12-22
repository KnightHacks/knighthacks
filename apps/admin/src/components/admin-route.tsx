import type { RouteProps } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { Redirect, Route } from "wouter";

export function AdminRoute(props: RouteProps) {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <>Loading...</>;
  }

  if (!isSignedIn) {
    return <Redirect to="/signin" />;
  }

  if (!user.primaryEmailAddress?.emailAddress.endsWith("@knighthacks.org")) {
    return <>You don&apos;t have access to this page.</>;
  }
  return <Route {...props} />;
}
