import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { trpc } from "~/trpc";
import { UserProfileForm } from "../_components/user-profile-form";

export default async function Profile() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: user, isLoading, error } = trpc.users.getById.useQuery(userId);
  if (!user) {
    redirect("/sign-in");
  }

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <UserProfileForm user={user.profile} />;
}
