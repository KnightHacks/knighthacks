import { SignIn, useAuth } from "@clerk/clerk-react";
import { Redirect } from "wouter";

export function HackathonSignIn() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect to="/hackathon/account-registration" replace />;
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <SignIn afterSignInUrl="/hackathon/account-registration" />
    </div>
  );
}
