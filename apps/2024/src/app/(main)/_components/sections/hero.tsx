// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@knighthacks/ui/button";

// export function Hero() {
//   return (
//     <section
//       id="hero"
//       className="relative flex h-screen flex-col items-center justify-center"
//       style={{
//         backgroundImage: "url('/sky.svg')",
//         backgroundRepeat: "no-repeat",
//         backgroundSize: " cover",
//         backgroundPosition: "top 10%", // Adjust this value as needed
//       }}
//     >
//       <Image src="/ship.svg" width={200} height={200} alt="ship" />
//       <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
//         KnightHacks 2024
//       </h1>
//       <div className="mb-4 flex gap-2">
//         <div>Engineering 1</div> • <div>Oct 4-6</div>
//       </div>
//       <div className="flex gap-2">
//         <Link href="/application/profile" passHref legacyBehavior>
//           <Button>Apply</Button>
//         </Link>
//         <Button variant="secondary" asChild>
//           <a href="mailto:sponsorship@knighthacks.org">Sponsor Us</a>
//         </Button>
//       </div>
//       <div className="relative mx-auto h-[400px] w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
//         <Image fill src="/island.svg" alt="Knight Hacks island" />
//       </div>
//     </section>
//   );
// }
import Image from "next/image";
import Link from "next/link";
import { Button } from "@knighthacks/ui/button";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-screen flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/sky.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top 10%", // Adjust this value as needed
      }}
    >
      {/* Positioned pirate ship towards the left */}
      <div
        className="absolute left-0 top-1/2  -translate-y-80 transform"
        style={{ width: "400px", height: "400px" }}
      >
        <Image src="/ship.svg" layout="fill" alt="ship" objectFit="contain" />
      </div>
      <div
        className="absolute left-1/2 top-10 -translate-x-1/2 -translate-y-full transform"
        style={{ width: "500px", height: "500px" }}
      >
        <Image
          src="/clouds.svg"
          layout="fill"
          alt="clouds"
          objectFit="contain"
        />
      </div>
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
      <div className="relative mx-auto h-[400px] w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
        <Image fill src="/island.svg" alt="Knight Hacks island" />
      </div>
    </section>
  );
}

// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@knighthacks/ui/button";

// export function Hero() {
//   return (
//     <section
//       id="hero"
//       className="relative flex h-screen flex-col items-center justify-center"
//       style={{
//         backgroundImage: "url('/sky.svg')",
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "cover",
//         backgroundPosition: "top 10%", // Adjust this value as needed
//       }}
//     >
//       {/* Positioned pirate ship towards the left */}
//       <div
//         className="absolute left-0 top-1/2 -translate-y-80 transform"
//         style={{ width: "400px", height: "400px" }}
//       >
//         <Image src="/ship.svg" layout="fill" alt="ship" objectFit="contain" />
//       </div>
//       {/* Adjusted clouds position and size */}
//       <div
//         className="absolute left-1/2 top-10 -translate-x-1/2 -translate-y-full transform"
//         style={{ width: "200px", height: "100px" }}
//       >
//         <Image
//           src="/clouds.svg"
//           layout="fill"
//           alt="clouds"
//           objectFit="contain"
//         />
//       </div>
//       <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
//         KnightHacks 2024
//       </h1>
//       <div className="mb-4 flex gap-2">
//         <div>Engineering 1</div> • <div>Oct 4-6</div>
//       </div>
//       <div className="flex gap-2">
//         <Link href="/application/profile" passHref legacyBehavior>
//           <Button>Apply</Button>
//         </Link>
//         <Button variant="secondary" asChild>
//           <a href="mailto:sponsorship@knighthacks.org">Sponsor Us</a>
//         </Button>
//       </div>
//       <div className="relative mx-auto h-[400px] w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
//         <Image fill src="/island.svg" alt="Knight Hacks island" />
//       </div>
//     </section>
//   );
// }
