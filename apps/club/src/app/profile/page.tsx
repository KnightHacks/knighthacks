import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

// import FormSelection from "../_components/profile-form-selection";

export const runtime = "edge";

export default function Profile() {
  const { userId } = auth();
  console.log(userId);

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      {/* <FormSelection userId={userId} /> */}
    </div>
  );
}
