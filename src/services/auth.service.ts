import { supabase } from "@/lib/supabase";
import type { SignInInput, SignUpInput } from "@/types/auth";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export const authService = {
  signUp({ email, password }: SignUpInput) {
    return supabase.auth.signUp({
      email,
      password,
    });
  },

  signIn({ email, password }: SignInInput) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signOut() {
    return supabase.auth.signOut();
  },

  getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(
    callback: (
      event: AuthChangeEvent,
      session: Session | null,
    ) => void | Promise<void>,
  ) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
