import { type Session } from '@supabase/supabase-js';
import { create } from 'zustand';

interface SessionStore {
  session?: Session;
  setSession: (session?: Session) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: undefined,
  setSession: (session?: Session) => set({ session }),
}));
