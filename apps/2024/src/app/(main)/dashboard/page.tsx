import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@knighthacks/ui/tabs";

import { trpc } from "~/trpc/server";
import { ConfirmStatusForm } from "./_components/confirm-status-form";
import { UpdateProfileForm } from "./_components/update-profile-form";
import { UpdateSurveyForm } from "./_components/update-survey-form";

export const runtime = "edge";

export default async function Dashboard() {
  const user = await trpc.user.getUser.query();
  if (!user) redirect("/application/profile");

  const application = await trpc.hacker.getApplication.query();
  if (!application) redirect("/application/survey");

  return (
    <div className="bg-[url('/sky-register.svg')] bg-cover px-8 pt-20">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {user.hackers[0]?.status !== "accepted" ? (
            <TabsTrigger value="application">Application</TabsTrigger>
          ) : (
            <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="profile">
          <UpdateProfileForm user={user} />
        </TabsContent>
        {user.hackers[0]?.status !== "accepted" ? (
          <TabsContent value="application">
            <UpdateSurveyForm application={application} />
          </TabsContent>
        ) : (
          <TabsContent value="confirmation">
            <ConfirmStatusForm />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
