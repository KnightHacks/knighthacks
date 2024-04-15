import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { ProfileForm } from "./profile-form";

export const runtime = "edge";

export default function Profile() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <ProfileForm userId={userId} />
    </div>
  );
}
