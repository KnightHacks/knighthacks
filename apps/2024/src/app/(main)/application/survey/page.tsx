import { redirect } from "next/navigation";

import { trpc } from "~/trpc/server";
import { SurveyForm } from "./survey-form";

export const runtime = "edge";

export default async function Survey() {
  const profile = await trpc.user.getProfile.query();
  if (!profile) redirect("/application/profile");

  const application = await trpc.hacker.getApplication.query();
  if (application) redirect("/dashboard");
  return <SurveyForm />;
}
