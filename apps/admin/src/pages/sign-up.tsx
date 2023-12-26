import { SignUp as ClerkSignUp, useAuth, useClerk } from "@clerk/clerk-react";
import { Redirect } from "wouter";

import { Skeleton } from "~/components/ui/skeleton";

export function SignUp() {
  const { isSignedIn } = useAuth();
  const { loaded } = useClerk();

  if (isSignedIn) {
    return <Redirect to="/" />;
  }

  const form = loaded ? (
    <ClerkSignUp />
  ) : (
    <Skeleton className="h-[464.25px] w-[400px] rounded-2xl" />
  );

  return <div className="flex flex-1 items-center justify-center">{form}</div>;
}
