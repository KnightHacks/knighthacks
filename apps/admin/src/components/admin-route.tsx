import type { RouteProps } from "wouter";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Redirect, Route } from "wouter";

import { LoadingOverlay } from "./loading-overlay";
import { Button } from "./ui/button";

export function AdminRoute(props: RouteProps) {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <LoadingOverlay />;
  }

  if (!isSignedIn) {
    return <Redirect to="/sign-in" />;
  }

  if (!user.primaryEmailAddress?.emailAddress.endsWith("@knighthacks.org")) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="mb-4">You don&apos;t have access to this application</p>
        <Button asChild>
          <SignOutButton />
        </Button>
      </div>
    );
  }
  return <Route {...props} />;
}
