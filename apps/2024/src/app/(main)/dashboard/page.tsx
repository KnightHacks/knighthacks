import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@knighthacks/ui/tabs";

import { trpc } from "~/trpc/server";
import { UpdateProfileForm } from "./_components/update-profile-form";

export const runtime = "edge";

export default async function Dashboard() {
  const user = await trpc.user.getUser.query();
  if (!user) redirect("/application/profile");

  const application = await trpc.hacker.getApplication.query();
  if (!application) redirect("/application/survey");

  return (
    <div className="px-8 pt-20">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <UpdateProfileForm user={user} />
        </TabsContent>
        <TabsContent value="application">Application content</TabsContent>
      </Tabs>
    </div>
  );
}
