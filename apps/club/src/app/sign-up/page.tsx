import { redirect } from "next/navigation";
import { SignUp as ClerkSignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default function SignUp() {
  const { userId } = auth();
  if (userId) {
    redirect("/profile");
  }

  return (
    <div className="flex justify-center">
      <ClerkSignUp />
    </div>
  );
}
