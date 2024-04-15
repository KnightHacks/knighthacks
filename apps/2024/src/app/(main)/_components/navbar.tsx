import Link from "next/link";
import { auth } from "@clerk/nextjs";

import { Button } from "@knighthacks/ui/button";

import { SignOutButton } from "./sign-out-button";

export function Navbar() {
  const { userId } = auth();

  return (
    <nav className="fixed flex h-16 w-full items-center justify-between px-8">
      <div>
        <Link
          href="/#hero"
          className="text-xl font-bold"
          passHref
          legacyBehavior
        >
          <Button variant="ghost" className="text-xl font-bold">
            KnightHacks
          </Button>
        </Link>
      </div>
      <ul className="flex items-center">
        <li>
          <Link href="/#about" passHref legacyBehavior>
            <Button variant="ghost">About</Button>
          </Link>
        </li>
        <li>
          <Link href="/#faq" passHref legacyBehavior>
            <Button variant="ghost">FAQ</Button>
          </Link>
        </li>
        <li>
          <Link href="/#sponsors" passHref legacyBehavior>
            <Button variant="ghost">Sponsors</Button>
          </Link>
        </li>
      </ul>
      <div>
        {userId ? (
          <SignOutButton />
        ) : (
          <Link href="/sign-in" passHref legacyBehavior>
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
