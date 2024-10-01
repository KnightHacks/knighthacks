"use client";

import { Oscillate } from "../../_components/oscillate";

export function CapacityReached() {
  return (
    <div className="flex justify-center">
      <Oscillate delay={0}>
        <h1 className="font-k2d mb-[175px] mt-[175px] w-[750px] rounded-lg bg-[#0D3047] p-[20px] text-center text-[36px] font-bold text-[#FFD166]">
          Arrr, mateys! The ship's at full capacity, <br /> and there be no more
          room <br /> in the crew for this year's hackathon voyage!
        </h1>
      </Oscillate>
    </div>
  );
}
