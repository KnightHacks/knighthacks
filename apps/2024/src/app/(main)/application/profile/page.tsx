import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { trpc } from "~/trpc/server";
import { ProfileForm } from "./profile-form";

export const runtime = "edge";

export default async function Profile() {
  const profile = await trpc.user.profile.query();
  if (profile) redirect("/application/survey");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return <ProfileForm />;
}
