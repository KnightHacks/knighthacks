import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export default function SignIn() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <ClerkSignIn />
    </div>
  );
}
