import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/hooks/useSession";

export function SignIn() {
  const { session } = useSession();

  if (!session) {
    return (
      <button
        onClick={() => {
          supabase.auth.signInWithOAuth({
            provider: "google",
          });
        }}
      >
        Sign in with Google
      </button>
    );
  } else {
    return (
      <button
        onClick={async () => {
          console.log("sign out");
          await supabase.auth.signOut();
          console.log("signed out");
        }}
      >
        Sign Out
      </button>
    );
  }
}
