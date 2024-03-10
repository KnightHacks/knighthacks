import { redirect } from "next/navigation";
import { auth, SignIn } from "@clerk/nextjs";

export const runtime = "edge";

export default function SignInComp() {
  const { userId }: { userId: string | null } = auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
