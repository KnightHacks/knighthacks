import Image from "next/image";
import Link from "next/link";
import { Button } from "@knighthacks/ui/button";

import { trpc } from "~/trpc/server";

export async function Hero() {
  let hacker = null;
  try {
   hacker = await trpc.hacker.getApplication.query();

  } catch (err) {
    console.error(err);
  }
  return (
    <section
      id="hero"
      className="relative flex h-screen flex-col items-center justify-center pt-24"
      style={{
        backgroundImage: "url('/sky.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top 10%", // Adjust this value as needed
      }}
        >
      <div className="relative z-20 mb-4 h-24 w-72 md:h-64 md:w-[32rem] lg:h-80 lg:w-[40rem]">
        <Image src="/header.svg" fill alt="Header" className="object-contain" />
      </div>
      <div className="z-20 mb-4 flex gap-2">
        <Link href="/application/profile" passHref legacyBehavior>
          <Button>{hacker ? "Dashboard" : "Apply"}</Button>
        </Link>
        <Button variant="secondary" asChild>
          <a href="mailto:sponsorship@knighthacks.org">Sponsor Us</a>
        </Button>
      </div>
      <div className="relative mx-auto h-[300px] w-[300px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
        <Image fill src="/island.svg" alt="Knight Hacks island" />
      </div>
      <div className="absolute left-[45rem] top-64 z-10 h-[100px] w-[200px] md:h-[250px] md:w-[250px]">
        <Image fill src="/cloud.svg" alt="Cloud" className="opacity-70" />
      </div>
      <div className="absolute left-52 top-24 z-10 h-[100px] w-[200px] md:h-[450px] md:w-[450px]">
        <Image fill src="/cloud.svg" alt="Cloud" />
      </div>
      <div className="absolute left-12 top-36 h-[100px] w-[200px] md:h-[450px] md:w-[450px]">
        <Image fill src="/cloud.svg" alt="Cloud" className="opacity-75" />
      </div>
      <div className="absolute right-52 top-12 z-10 h-[100px] w-[200px] md:h-[450px] md:w-[450px]">
        <Image fill src="/cloud.svg" alt="Cloud" />
      </div>
      <div className="absolute right-12 top-44 h-[100px] w-[200px] md:h-[450px] md:w-[450px]">
        <Image fill src="/cloud.svg" alt="Cloud" className="opacity-75" />
      </div>
      <div className="absolute left-12 top-96 z-10 hidden h-[200px] w-[200px] md:h-[500px] md:w-[500px] lg:block">
        <Image fill src="/ship.svg" alt="Ship" />
      </div>
      {/* <div className="absolute left-32 top-[30rem] h-[200px] w-[200px] md:h-[450px] md:w-[450px]">
        <Image fill src="/cloud.svg" alt="Cloud" className="opacity-50" />
      </div> */}}
    </section>
  );
}
