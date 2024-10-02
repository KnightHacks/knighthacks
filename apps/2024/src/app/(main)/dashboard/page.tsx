import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@knighthacks/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from '@knighthacks/ui/card';
import { trpc } from "~/trpc/server";
import { CapacityReached } from "./_components/capacity-reached";
import { ConfirmStatusForm } from "./_components/confirm-status-form";
import { UpdateProfileForm } from "./_components/update-profile-form";
import { UpdateSurveyForm } from "./_components/update-survey-form";

export const runtime = "edge";

export default async function Dashboard() {
  try {
    const user = await trpc.user.getUser.query();
    if (!user) redirect("/application/sign-in");

    const application = await trpc.hacker.getApplication.query();
    if (!application) redirect("/application/profile");

    const CONFIRMATION_CAP = 720;

    const confirmedHackerCount =
      await trpc.hacker.getConfirmedHackerCount.query();

    const hacker = user.hackers.find((hacker) => hacker.hackathonID === 1);

    return (
      <div className="h-auto bg-[url('/sky-register.svg')] bg-cover px-8 pt-20">
        <Tabs defaultValue='status'>
          <TabsList>
            <TabsTrigger value='status'>Status</TabsTrigger>
            {hacker?.status === "accepted" || hacker?.status === "confirmed" ? (
              <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
            ) : (
              <TabsTrigger value="application">Application</TabsTrigger>
            )}
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value='status'>
            <div className="h-screen flex flex-col items-center justify-start">
            <Card className="w-1/3">
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Current status of your hackathon application</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {hacker?.status ? hacker.status.charAt(0).toUpperCase() + hacker.status.slice(1) : 'Not Applied'}
                </p>
                {hacker?.status === 'pending' && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your application is currently under review. We'll notify you once a decision has been made.
                  </p>
                )}
                {hacker?.status === 'accepted' && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Congratulations! Your application has been accepted. Please confirm your attendance in the Confirmation tab.
                  </p>
                )}
                {hacker?.status === 'confirmed' && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    You're all set! We look forward to seeing you at the hackathon.
                  </p>
                )}
                {hacker?.status === 'denied' && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    We're sorry, but your application was not accepted this time. We encourage you to apply for future events!
                  </p>
                )}
                {hacker?.status === 'waitlisted' && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your application has been waitlisted. We'll notify you if a spot opens up.
                    </p>
                )}
                {hacker?.status === "withdrawn" && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    You have withdrawn your application.
                  </p>
                )}
                {hacker?.status === "checkedin" && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    You have checked in to the event.
                  </p>
                )}
              </CardContent>
            </Card>
            </div>
          </TabsContent>
          <TabsContent value="profile">
            <UpdateProfileForm user={user} />
          </TabsContent>
          {hacker?.status === "accepted" || hacker?.status === "confirmed" ? (
            <TabsContent value="confirmation">
              {confirmedHackerCount > CONFIRMATION_CAP &&
              hacker.status !== "confirmed" ? (
                <CapacityReached />
              ) : (
                <ConfirmStatusForm hacker={hacker} />
              )}
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
