import { redirect } from "next/navigation";
import { auth, SignUp as ClerkSignUp } from "@clerk/nextjs";

export default function SignUp() {
  const { userId }: { userId: string | null } = auth();

  if (userId) {
    redirect("/profile");
  }
  return <ClerkSignUp />;
}
