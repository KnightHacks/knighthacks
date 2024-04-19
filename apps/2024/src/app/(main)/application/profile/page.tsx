import { redirect } from "next/navigation";

import { getCurrentUser } from "~/utils";
import { ProfileForm } from "./profile-form";

export default async function Profile() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (user.profile) redirect("/application/survey");

  return <ProfileForm userId={user.id} />;
}
