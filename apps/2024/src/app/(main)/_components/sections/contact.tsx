"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Contact() {
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

  return (
    <section
      id="contact"
      className="relative flex h-screen flex-col items-center justify-center space-y-2 text-center md:text-left"
    >
      <h1 className="font-k2d z-50 text-center text-5xl font-semibold text-black">
        Get in Touch!
      </h1>
      <p className="z-50 px-2 text-sm md:text-base">
        Care to learn more about Knight Hacks?
      </p>
      <p className="z-50 mb-36 px-2 text-sm md:mb-0 md:text-base">
        Email our organizers at{" "}
        <a href="mailto:hackteam@knighthacks.org" className="underline">
          hackteam@knighthacks.org
        </a>{" "}
        for more information!
      </p>
      <div className="absolute bottom-0 h-[20%] w-full overflow-hidden">
        <Image
          src="/sand.svg"
          alt="Sandy Beach Floor"
          layout="fill"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0">
        <Image
          src="/algae1.svg"
          alt="Algae on the left"
          width={isMobile ? screenWidth * 0.3 : screenWidth * 0.15}
          height={isMobile ? screenWidth * 0.2 : screenWidth * 0.1}
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 left-[10%] hidden md:block">
        <Image
          src="/algae2.svg"
          alt="Algae on the left"
          width={isMobile ? screenWidth * 0.3 : screenWidth * 0.15}
          height={isMobile ? screenWidth * 0.6 : screenWidth * 0.15}
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 right-[10%] hidden md:block">
        <Image
          src="/algae.svg"
          alt="Algae on the right"
          width={isMobile ? screenWidth * 0.3 : screenWidth * 0.15}
          height={isMobile ? screenWidth * 0.6 : screenWidth * 0.3}
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 right-[20%] translate-y-[-10%] transform md:right-[30%]">
        <Image
          src="/skull.svg"
          alt="Skull"
          width={isMobile ? screenWidth * 0.3 : screenWidth * 0.15}
          height={isMobile ? screenWidth * 0.6 : screenWidth * 0.1}
          className="scale-50 object-contain md:scale-75"
        />
      </div>
      <div className="absolute bottom-0 right-[55%] translate-y-[-10%] transform md:right-[60%]">
        <Image
          src="/treasure.svg"
          alt="Treasure"
          width={isMobile ? screenWidth * 0.3 : screenWidth * 0.15}
          height={isMobile ? screenWidth * 0.6 : screenWidth * 0.3}
          className="scale-75 object-contain md:scale-100"
        />
      </div>
      <div className="absolute bottom-0 right-0">
        <Image
          src="/algae3.svg"
          alt="Algae on the right"
          width={isMobile ? screenWidth * 0.3 : screenWidth * 0.15}
          height={isMobile ? screenWidth * 0.2 : screenWidth * 0.05}
          className="object-contain"
        />
      </div>
    </section>
  );
}
