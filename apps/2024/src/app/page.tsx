import { ThemeToggle } from "@knighthacks/design-system/components";

import { SignInSignOutButton } from "../components/sign-in-sign-out-button";

export default function Home() {
  return (
    <div>
      <div>This is the home page!</div>
      <ThemeToggle />
      <SignInSignOutButton />
    </div>
  );
}
