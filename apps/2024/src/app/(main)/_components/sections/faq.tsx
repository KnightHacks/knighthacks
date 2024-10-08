"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@knighthacks/ui/accordion";

export function FAQ() {
  const FAQs: Record<string, string> = {
    "What is a Hackathon?":
      "A hackathon is a weekend-long event where students come together to learn the latest technologies and build innovative projects. These projects can range from involving web or mobile development to building a hardware project, or anything in between. Hackathons are a great way to learn new skills, meet new people, and have fun! Additionally, throughout the weekend we will be hosting workshops, fun social events, networking opportunities with sponsors, free food & swag, and so much more.",
    "How long is Knight Hacks?":
      "Knighthacks is a 36-hour hackathon, beginning at 5pm on Friday (check-in runs from 5-8pm, with the opening ceremony starting at 8pm) and ending at 6pm on Sunday. We encourage you to work on your project for as long as you can during this time.",
    "Who can attend Knight Hacks?":
      "If you’re currently a college student(18+) or have graduated in the past year, you're more than welcome to attend!",
    "Do I need to have a team?":
      "Not at all! You can be a lone wolf, come with a team (no more than four people), or join some teams at KnightHacks. We’ll also have team building activities to help you find the right teammates!",
    "How much experience do I need?":
      "None! We welcome students from all academic backgrounds and skill levels, so don’t be afraid to come and join us! We’ll have introductory workshops for you to learn new skills, industry mentors to help you out, and great tools to build your projects. Whether you’ve never coded before or have lots of experience, there’s a place for you at KnightHacks!",
    "Will there be travel assistance?":
      "No we do not offer reimbursements or busses this year",
  };

  return (
    <section
      id="faq"
      className="flex h-auto w-full flex-col items-center justify-center "
    >
      <h1 className="font-k2d text-center text-5xl font-semibold text-[#FFD166]">
        Frequently Asked Questions
      </h1>
      <div className="flex w-full flex-col items-center justify-center p-5">
        {Object.entries(FAQs).map(([key, value]) => (
          <Accordion type="single" collapsible key={key} className="w-full">
            <AccordionItem
              value="item-1"
              className="mx-auto mb-6 w-full flex-col items-start rounded-[20px] bg-[#7CCCFF] p-5 md:w-[1000px]"
            >
              <AccordionTrigger className=" w-full  rounded-t-xl  p-4 text-black hover:no-underline">
                <h3 className="text-xl font-bold">{key}</h3>
              </AccordionTrigger>
              <AccordionContent className="rounded-b-xl px-4 py-3 text-black md:text-lg">
                {value}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
