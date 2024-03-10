"use client";

import { useState } from "react";

import { Button } from "@knighthacks/ui/button";
import { Textarea } from "@knighthacks/ui/textarea";

import { trpc } from "~/trpc";

export default function HackathonRegister() {
  const [whyAttend, setWhyAttend] = useState("");
  const [whatLearn, setWhatLearn] = useState("");
  const { mutate } = trpc.hackers.register.useMutation();

  const userId = "1";
  const hackathonId = 1;
  const status:
    | "applied"
    | "accepted"
    | "waitlisted"
    | "checkedin"
    | undefined = "applied";

  return (
    <div className="mx-4 space-y-4">
      <h1>Just a couple more questions, Pirate!</h1>
      <Textarea
        placeholder="Why do you want to attend Knight Hacks?"
        className="max-w-4xl px-4 py-4"
        value={whyAttend}
        onChange={(e) => setWhyAttend(e.target.value)}
      />
      <Textarea
        placeholder="What do you want to learn at Knight Hacks?"
        className="max-w-4xl px-4 py-4"
        value={whatLearn}
        onChange={(e) => setWhatLearn(e.target.value)}
      />
      <Button
        onClick={() => {
          try {
            mutate({ userId, hackathonId, whyAttend, whatLearn, status });
          } catch (err) {
            console.log("error: ", err);
          }
        }}
      >
        Finish
      </Button>
    </div>
  );
}
