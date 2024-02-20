import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export default function SignUp() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <ClerkSignUp afterSignUpUrl="/dashboard" afterSignInUrl="/dashboard" />
    </div>
  );
}
