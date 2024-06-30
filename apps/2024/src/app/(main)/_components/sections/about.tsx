import Image from "next/image";

export function About() {
  return (
    <section
      id="about"
      className="relative flex h-screen items-center justify-center bg-[url('/ocean.svg')] bg-cover"
    >
      <div className="relative mx-auto h-[400px] w-[400px] md:h-[500px] md:w-[500px] lg:h-[800px] lg:w-[800px]">
        <Image
          fill
          src="/about.svg"
          alt="Map with Knight Hacks logo and Lenny the dragon"
        />
      </div>
    </section>
  );
}
