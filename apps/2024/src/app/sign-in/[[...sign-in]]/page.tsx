import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export const runtime = "edge";

export default function SignIn() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <ClerkSignIn />
    </div>
  );
}
