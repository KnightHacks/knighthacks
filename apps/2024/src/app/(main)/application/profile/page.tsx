import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { trpc } from "~/trpc/server";
import { ProfileForm } from "./profile-form";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function Profile() {
  const profile = await trpc.user.getProfile.query();
  if (profile) redirect("/application/survey");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="bg-[url('/sky-register.svg')] bg-cover bg-no-repeat">
      <ProfileForm />
    </div>
  );
}
