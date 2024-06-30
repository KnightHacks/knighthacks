import { About } from "./_components/sections/about";
import { Contact } from "./_components/sections/contact";
import { FAQ } from "./_components/sections/faq";
import { Hero } from "./_components/sections/hero";
import { Sponsors } from "./_components/sections/sponsors";

export const runtime = "edge";

export default function Home() {
  return (
    <main className="w-screen overflow-hidden bg-[#3d97d1]">
      <Hero />
      <About />
      <div className="bg-[url('/bottom-ocean.svg')] bg-cover bg-no-repeat">
        <Sponsors />
        <FAQ />
        <Contact />
      </div>
    </main>
  );
}
