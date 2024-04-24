import { redirect } from "next/navigation";

import { trpc } from "~/trpc/server";
import { HACKATHON_ID } from "~/utils";
import { SurveyForm } from "./survey-form";

export default async function Survey() {
  const user = await trpc.user.current.query();

  if (!user) redirect("/sign-in");
  if (!user.profile) redirect("/application/profile");
  if (user.hackers.find((hacker) => hacker.hackathonId === HACKATHON_ID))
    redirect("/");

  return <SurveyForm userId={user.id} />;
}
