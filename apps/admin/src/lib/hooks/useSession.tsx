import { useEffect, useState } from "react";

import { useSessionStore } from "../stores/session-store";
import { supabase } from "../supabase";

export function useSession() {
  const [isFetchingSession, setIsFetchingSession] = useState(true);
  const { session, setSession } = useSessionStore();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session) {
          setSession(session);
        }
        setIsFetchingSession(false);
      })
      .catch((error) => {
        console.error(error);
        setIsFetchingSession(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? undefined);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  return { session, setSession, isFetchingSession };
}
