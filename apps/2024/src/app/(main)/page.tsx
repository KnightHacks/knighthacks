import { About } from "./_components/sections/about";
import { Contact } from "./_components/sections/contact";
import { FAQ } from "./_components/sections/faq";
import { Hero } from "./_components/sections/hero";
import { Sponsors } from "./_components/sections/sponsors";

export const runtime = "edge";

export default async function Home() {
  return (
    <main>
      <Hero />
      <About />
      <FAQ />
      <Sponsors />
      <Contact />
    </main>
  );
}
