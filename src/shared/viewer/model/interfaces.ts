import type { Session, User } from '@supabase/supabase-js';

export interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export interface RegistrationResult {
  session: Session | null;
  user: User | null;
}
