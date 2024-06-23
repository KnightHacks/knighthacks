import { redirect } from "next/navigation";
import { SignIn as ClerkSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default function SignIn() {
  const { userId } = auth();
  if (userId) {
    redirect("/profile");
  }

  return (
    <div className="flex items-center justify-center">
      <ClerkSignIn />
    </div>
  );
}
