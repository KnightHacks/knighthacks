"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@knighthacks/ui";
import { Button } from "@knighthacks/ui/button";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { MobileSheet } from "./navbar-sheet";
import { SignOutButton } from "./sign-out-button";

export function Navbar({ userId }: { userId: string | null }) {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener to update the screen width on resize
    window.addEventListener("resize", handleResize);

    // Initial screen width
    setScreenWidth(window.innerWidth);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = screenWidth < 768;

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
    <>
      <motion.nav
        animate={{ y: hidden ? "-100%" : 0 }}
        transition={{ type: "tween", duration: 0.2 }}
        className={cn(
          "fixed z-50 flex h-16 w-full items-center bg-[#0D3047] px-2 md:px-4",
        )}
      >
        <MobileSheet userId={userId} />

        <div className="flex items-center hover:cursor-pointer">
          <Link
            href="/#hero"
            passHref
            legacyBehavior
            className="hover:cursor-pointer"
          >
            <Image
              src="/kh-logo.svg"
              alt="kh-logo"
              width={200}
              height={300}
              className="hover:cursor-pointer"
            />
          </Link>
        </div>
        <div className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center space-x-4">
            <li>
              <Link href="/#about" passHref legacyBehavior>
                <Button variant="ghost" className="text-white">
                  About
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/#faq" passHref legacyBehavior>
                <Button variant="ghost" className="text-white">
                  FAQ
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/#sponsors" passHref legacyBehavior>
                <Button variant="ghost" className="text-white">
                  Sponsors
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/#contact" passHref legacyBehavior>
                <Button variant="ghost" className="text-white">
                  Contact
                </Button>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex">
            {userId ? (
              <SignOutButton />
            ) : (
              <Link href="/sign-in" passHref legacyBehavior>
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
          <motion.div
            animate={{ y: hidden ? "-250%" : 0 }}
            transition={{ type: "tween", duration: 0.35 }}
            className="flex items-center"
          >
            <Image
              src="/mlh-badge.svg"
              alt="MLH Badge"
              width={isMobile ? 50 : 100}
              height={isMobile ? 100 : 200}
              className="-mb-6 object-contain md:-mb-28"
            />
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
}
