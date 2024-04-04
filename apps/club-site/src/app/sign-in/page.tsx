import { redirect } from "next/navigation";
import { auth, SignIn as ClerkSignIn } from "@clerk/nextjs";

export const runtime = "edge";
export default function SignUp() {
  const { userId }: { userId: string | null } = auth();
  if (userId) {
    redirect("/profile");
  }

  return (
    <div className="flex items-center justify-center">
      <ClerkSignIn />
    </div>
  );
}
