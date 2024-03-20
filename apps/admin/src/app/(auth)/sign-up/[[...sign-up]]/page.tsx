import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export const runtime = "edge";

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClerkSignUp />
    </div>
  );
}
