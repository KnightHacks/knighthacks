import { redirect } from "next/navigation";

import { trpc } from "~/trpc/server";
import { SurveyForm } from "./survey-form";

export default async function Survey() {
  const application = await trpc.hacker.application.query();
  if (application) redirect("/dashboard");
  return <SurveyForm />;
}
