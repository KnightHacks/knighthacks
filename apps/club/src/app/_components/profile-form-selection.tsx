// "use client";

// import { redirect } from "next/navigation";

// import { trpc } from "~/trpc";
// import { AddProfileForm } from "./add-profile-form";
// import { UpdateProfileForm } from "./update-profile-form";

// export default function FormSelection({ userId }: { userId: string }) {
//   const { data: user, isLoading, error } = trpc.user.byId.useQuery(userId);

//   if (isLoading) return <div>Loading...</div>;

//   if (error) return <div>Error: {error.message}</div>;

//   if (!user) redirect("/sign-up");

//   if (!user.profile) return <AddProfileForm userId={userId} />;

//   return <UpdateProfileForm userProfile={user.profile} />;
// }
