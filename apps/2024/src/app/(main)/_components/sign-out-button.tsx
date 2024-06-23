"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@knighthacks/ui/button";

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <Button onClick={() => signOut(() => router.push("/"))}>Sign Out</Button>
  );
}
