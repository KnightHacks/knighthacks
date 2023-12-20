import { Redirect } from "wouter";

import { useSessionStore } from "~/lib/stores/session-store";
import { supabase } from "~/lib/supabase";

export function SignIn() {
  const { session } = useSessionStore();

  if (session) {
    return <Redirect to="/" />;
  }

  return (
    <button
      onClick={() => {
        void supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "/",
          },
        });
      }}
    >
      Sign in with Google
    </button>
  );
}
