import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface SessionStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  setSession: (session: Session | null) => set({ session }),
}));
