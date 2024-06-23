import Link from "next/link";
import { Button } from "@knighthacks/ui/button";

import { Island } from "../island";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-screen flex-col items-center justify-center pt-16"
    >
      <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
        KnightHacks 2024
      </h1>
      <div className="mb-4 flex gap-2">
        <div>Engineering 1</div> • <div>Oct 4-6</div>
      </div>
      <div className="flex gap-2">
        <Link href="/application/profile" passHref legacyBehavior>
          <Button>Apply</Button>
        </Link>
        <Button variant="secondary" asChild>
          <a href="mailto:sponsorship@knighthacks.org">Sponsor Us</a>
        </Button>
      </div>
      <div className="relative w-full">
        <Island />
      </div>
    </section>
  );
}
