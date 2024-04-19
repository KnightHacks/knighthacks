import { redirect } from "next/navigation";

import { getCurrentUser, HACKATHON_ID } from "~/utils";
import { SurveyForm } from "./survey-form";

export const runtime = "edge";

export default async function Survey() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (!user.profile) redirect("/application/profile");
  if (user.hackers.find((hacker) => hacker.hackathonId === HACKATHON_ID))
    redirect("/");

  return <SurveyForm userId={user.id} />;
}
