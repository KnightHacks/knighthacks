"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@knighthacks/design-system/components";

export function SignInSignOutButton() {
  const { isSignedIn, signOut } = useAuth();

  if (isSignedIn) {
    return <Button onClick={() => signOut()}>Sign out</Button>;
  }

  return (
    <Link href="/sign-in">
      <Button>Sign in</Button>
    </Link>
  );
}
