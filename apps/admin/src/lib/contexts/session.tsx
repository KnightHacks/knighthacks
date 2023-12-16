import { Session } from "@supabase/supabase-js";
import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

interface SessionContextValues {
  session: Session | null;
  isFetchingSession: boolean;
}

export const SessionContext = createContext<SessionContextValues>({
  session: null,
  isFetchingSession: true,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isFetchingSession, setIsFetchingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsFetchingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <SessionContext.Provider value={{ session, isFetchingSession }}>
      {children}
    </SessionContext.Provider>
  );
}
