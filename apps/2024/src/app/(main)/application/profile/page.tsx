import { redirect } from "next/navigation";

import { trpc } from "~/trpc/server";
import { ProfileForm } from "./profile-form";

export default async function Profile() {
  const user = await trpc.user.current.query();

  if (!user) redirect("/sign-in");
  if (user.profile) redirect("/application/survey");

  return <ProfileForm userId={user.id} />;
}
