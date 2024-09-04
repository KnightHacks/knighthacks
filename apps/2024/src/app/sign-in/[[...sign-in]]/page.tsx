import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export const runtime = "edge";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/sky-register.svg')] bg-cover bg-no-repeat">
      <ClerkSignIn fallbackRedirectUrl={"/application/profile"} />
    </div>
  );
}
