import { SignIn as ClerkSignIn, useAuth, useClerk } from "@clerk/clerk-react";
import { Redirect } from "wouter";

import { Skeleton } from "~/components/ui/skeleton";

export function SignIn() {
  const { isSignedIn } = useAuth();
  const { loaded } = useClerk();

  if (isSignedIn) {
    return <Redirect to="/" />;
  }

  const form = loaded ? (
    <ClerkSignIn />
  ) : (
    <Skeleton className="h-[464.25px] w-[400px] rounded-2xl" />
  );

  return <div className="flex flex-1 items-center justify-center">{form}</div>;
}
