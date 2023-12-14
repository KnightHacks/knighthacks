import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../supabase";
import { Session } from "@supabase/supabase-js";

export interface SessionContextValues {
  session: Session | null;
  setSession: (session: Session) => void;
  isLoading: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export let accessToken: string | undefined;

export const SessionContext = createContext<SessionContextValues>({
  session: null,
  setSession: () => {},
  isLoading: true,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      accessToken = session?.access_token;
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      accessToken = session?.access_token;
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <SessionContext.Provider value={{ session, setSession, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  return useContext(SessionContext);
}
