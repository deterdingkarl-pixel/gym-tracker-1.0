import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  authError: string | null;
  initialized: boolean;
  init: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  authError: null,
  initialized: false,

  init: () => {
    set((state) => {
      if (state.initialized || !isSupabaseConfigured) return { loading: false, initialized: true };
      supabase.auth.getSession().then(({ data }) => {
        set({ session: data.session, user: data.session?.user ?? null, loading: false });
      });
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null, loading: false });
      });
      return { initialized: true };
    });
  },

  signIn: async (email, password) => {
    set({ authError: null, loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    if (error) {
      set({ authError: translateAuthError(error.message) });
      return false;
    }
    return true;
  },

  signUp: async (email, password) => {
    set({ authError: null, loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    if (error) {
      set({ authError: translateAuthError(error.message) });
      return false;
    }
    return true;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },

  clearError: () => set({ authError: null }),
}));

function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'E-Mail oder Passwort ist falsch.';
  if (message.includes('User already registered')) return 'Für diese E-Mail existiert bereits ein Konto — bitte anmelden.';
  if (message.includes('Password should be at least')) return 'Das Passwort muss mindestens 6 Zeichen lang sein.';
  if (message.includes('Email not confirmed')) return 'Bitte bestätige zuerst deine E-Mail-Adresse (Link in der Bestätigungsmail).';
  return message;
}
