import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@knighthacks/ui/tabs";

import { trpc } from "~/trpc/server";
import { ConfirmStatusForm } from "./_components/confirm-status-form";
import { UpdateProfileForm } from "./_components/update-profile-form";
import { UpdateSurveyForm } from "./_components/update-survey-form";

export const runtime = "edge";

export default async function Dashboard() {
  try {
    const user = await trpc.user.getUser.query();
    if (!user) redirect("/application/profile");

  const application = await trpc.hacker.getApplication.query();
  if (!application) redirect("/application/survey");

  const hacker = user.hackers.find((hacker) => hacker.hackathonID === 1);

  return (
    <div className="h-auto bg-[url('/sky-register.svg')] bg-cover px-8 pt-20">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {hacker?.status === "accepted" || hacker?.status === "confirmed" ? (
            <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
          ) : (
            <TabsTrigger value="application">Application</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="profile">
          <UpdateProfileForm user={user} />
        </TabsContent>
        {hacker?.status === "accepted" || hacker?.status === "confirmed" ? (
          <TabsContent value="confirmation">
            <ConfirmStatusForm hacker={hacker} />
          </TabsContent>
        ) : (
          <TabsContent value="application">
            <UpdateSurveyForm application={application} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
  } catch {
    redirect("/");
  }
}
