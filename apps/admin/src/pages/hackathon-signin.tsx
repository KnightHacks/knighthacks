import { Redirect } from "wouter";

import { useSession } from "~/lib/hooks/useSession";
import { supabase } from "~/lib/supabase";
import { trpc } from "~/lib/trpc";

export function HackathonSignIn() {
  // Get current user from session with tRPC
  const { session } = useSession();
  const { data: currentUser } = trpc.users.getCurrentUser.useQuery();

  // If the user is already signed in, and does not have a knight hacks account, redirect them to the account registration page
  if (session && !currentUser) {
    return <Redirect to="/hackathon/account-registration" />;
  }

  // If the user is already signed in, and has a knight hacks account, redirect them to the registration page
  if (session && currentUser) {
    return <Redirect to="/hackathon/registration" />;
  }

  return <SignInWithGithub />;
}

function SignInWithGithub() {
  return (
    <button
      onClick={async () => {
        await supabase.auth.signInWithOAuth({
          provider: "github",
        });
      }}
    >
      Sign In With Github
    </button>
  );
}
