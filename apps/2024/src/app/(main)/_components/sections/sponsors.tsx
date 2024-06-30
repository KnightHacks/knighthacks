import type { RouterOutput } from "@knighthacks/api";
import Image from "next/image";

import { trpc } from "~/trpc/server";
import { Oscillate } from "../oscillate";

export async function Sponsors() {
  const sponsors = await trpc.sponsor.userAll.query();
  const getSizes = (sponsor: RouterOutput["sponsor"]["userAll"][number]) => {
    const sizeMap = {
      gold: { bubbleSize: "large", cellSize: 350, imageSize: 135 },
      silver: { bubbleSize: "medium", cellSize: 275, imageSize: 100 },
      bronze: { bubbleSize: "small", cellSize: 175, imageSize: 75 },
      other: { bubbleSize: "small", cellSize: 175, imageSize: 75 },
    };

    return sizeMap[sponsor.tier];
  };

  return (
    <section
      id="sponsors"
      className="flex items-center justify-center  bg-[url('/sponsors.svg')] bg-cover bg-no-repeat pt-64 "
    >
      <div className="flex flex-col">
        <h1 className="font-k2d h-[125px] w-full text-center text-7xl font-bold leading-[125px] text-[#FFD166] md:pb-56 md:text-[96px]">
          Sponsors
        </h1>
        <div className="grid max-w-full auto-rows-auto grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 md:h-screen md:auto-rows-[275px] md:grid-cols-4">
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
