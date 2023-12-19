import { useSessionStore } from '@/lib/stores/session-store';
import { supabase } from '@/lib/supabase';
import { Redirect } from 'wouter';

export function SignIn() {
  const { session } = useSessionStore();

  if (session) {
    return <Redirect to="/" />;
  }

  return (
    <button
      onClick={() => {
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: '/',
          },
        });
      }}
    >
      Sign in with Google
    </button>
  );
}
