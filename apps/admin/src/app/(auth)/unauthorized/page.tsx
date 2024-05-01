import { SignOutButton } from "./sign-out-button";

export const runtime = "edge";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p className="mb-4">You don&apos;t have access to this application</p>
      <SignOutButton />
    </div>
  );
}
