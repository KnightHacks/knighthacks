"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@knighthacks/ui/button";

export function SignOut() {
  const { signOut } = useAuth();

  return <Button onClick={() => signOut()}>Sign Out</Button>;
}
