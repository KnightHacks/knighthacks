import { SignIn as ClerkSignIn, useClerk } from "@clerk/clerk-react";

import { Skeleton } from "~/components/ui/skeleton";

export function SignIn() {
  const { loaded } = useClerk();

  const form = loaded ? (
    <ClerkSignIn />
  ) : (
    <Skeleton className="h-[464.25px] w-[400px] rounded-2xl" />
  );

  return <div className="flex flex-1 items-center justify-center">{form}</div>;
}
