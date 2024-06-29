"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@knighthacks/ui";
import { Button } from "@knighthacks/ui/button";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

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
      transition={{ type: "tween", duration: 0.2 }}
      className={cn(
        "fixed z-50 flex h-16 w-full items-center justify-between bg-background bg-[url('/sky.svg')] px-8",
      )}
    >
      <div>
        <Link href="/#hero" passHref legacyBehavior>
          <Button
            variant="ghost"
            className="relative right-10 -z-10 mx-0 text-xl font-bold"
          >
            <Image src="/kh-logo.svg" alt="kh-logo" width={200} height={300} />
            {/* Knight Hacks */}
          </Button>
        </Link>
      </div>
      <ul className="hidden items-center md:flex">
        <li>
          <Link href="/#about" passHref legacyBehavior>
            <Button variant="ghost" className=" text-white">
              About
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/#faq" passHref legacyBehavior>
            <Button variant="ghost" className=" text-white">
              FAQ
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/#sponsors" passHref legacyBehavior>
            <Button variant="ghost" className=" text-white">
              Sponsors
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/#contact" passHref legacyBehavior>
            <Button variant="ghost" className=" text-white">
              Contact
            </Button>
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
