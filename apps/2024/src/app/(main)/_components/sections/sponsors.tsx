import Image from "next/image";

import type { InferSelectModel, sponsors } from "@knighthacks/db";

import { trpc } from "~/trpc/server";
import { Oscillate } from "../oscillate";

type Sponsor = InferSelectModel<typeof sponsors>;
export async function Sponsors() {
  const sponsors = await trpc.sponsor.userAll.query();
  const getSizes = (sponsor: Sponsor) => {
    const sizeMap = {
      gold: { bubbleSize: "large", cellSize: 350, imageSize: 135 },
      silver: { bubbleSize: "medium", cellSize: 275, imageSize: 100 },
      bronze: { bubbleSize: "small", cellSize: 175, imageSize: 75 },
      other: { bubbleSize: "small", cellSize: 175, imageSize: 75 },
    };

    const tier = sizeMap[sponsor.tier] ? sponsor.tier : "other";

    return sizeMap[tier];
  };

  return (
    <section id="sponsors" className="flex items-center justify-center">
      <div className="flex flex-col">
        <h1 className="font-k2d w-[405px]text-center h-[125px] text-center text-[96px] font-bold leading-[125px] text-[#FFD166]">
          Sponsors
        </h1>
        <div className="grid h-auto max-w-full auto-rows-[275px] grid-cols-4 gap-4 overflow-hidden">
          {sponsors.map((sponsor, index) => {
            const { bubbleSize, imageSize, cellSize } = getSizes(sponsor);
            const delay = Math.random() * 2;
            return (
              <div key={sponsor.id}>
                <Oscillate delay={delay}>
                  <div
                    className="row-span-1 p-10"
                    style={{ marginTop: index % 2 === 1 ? "100px" : "0" }}
                  >
                    <section
                      className="flex items-center justify-center"
                      id="bubble"
                      style={{
                        backgroundImage: `url(${bubbleSize}-bubble.svg)`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        height: cellSize,
                        width: cellSize,
                      }}
                    >
                      <a href={sponsor.website}>
                        <Image
                          width={imageSize}
                          height={imageSize}
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="rounded-full"
                        />
                      </a>
                    </section>
                  </div>
                </Oscillate>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
