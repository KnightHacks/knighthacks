"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@knighthacks/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@knighthacks/ui/sheet";

import { SignOutButton } from "./sign-out-button";

export function MobileSheet({ userId }: { userId: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Menu</Button>
        </SheetTrigger>
        <SheetContent>
          <Link href="/#hero" passHref legacyBehavior>
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              className="mb-2 text-xl font-bold"
            >
              KnightHacks
            </Button>
          </Link>
          <ul className="mb-4">
            <li>
              <Link href="/#about" passHref legacyBehavior>
                <Button onClick={() => setOpen(false)} variant="ghost">
                  About
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/#faq" passHref legacyBehavior>
                <Button onClick={() => setOpen(false)} variant="ghost">
                  FAQ
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/#sponsors" passHref legacyBehavior>
                <Button onClick={() => setOpen(false)} variant="ghost">
                  Sponsors
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/#contact" passHref legacyBehavior>
                <Button onClick={() => setOpen(false)} variant="ghost">
                  Contact
                </Button>
              </Link>
            </li>
          </ul>

          {userId ? (
            <SignOutButton />
          ) : (
            <Link href="/login" passHref>
              <Button onClick={() => setOpen(false)}>Login</Button>
            </Link>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
