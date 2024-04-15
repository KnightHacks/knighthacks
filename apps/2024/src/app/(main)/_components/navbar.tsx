"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { Button } from "@knighthacks/ui/button";

import { MobileSheet } from "./navbar-sheet";
import { SignOutButton } from "./sign-out-button";

export function Navbar({ userId }: { userId: string | null }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous && latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      animate={{ y: hidden ? "-100%" : 0 }}
      className="fixed flex h-16 w-full items-center justify-between bg-background px-8 shadow"
    >
      <div>
        <Link href="/#hero" passHref legacyBehavior>
          <Button variant="ghost" className="text-xl font-bold">
            KnightHacks
          </Button>
        </Link>
      </div>
      <ul className="hidden items-center md:flex">
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
        <li>
          <Link href="/#contact" passHref legacyBehavior>
            <Button variant="ghost">Contact</Button>
          </Link>
        </li>
      </ul>
      <div className="hidden md:block">
        {userId ? (
          <SignOutButton />
        ) : (
          <Link href="/sign-in" passHref legacyBehavior>
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
      <MobileSheet userId={userId} />
    </motion.nav>
  );
}
