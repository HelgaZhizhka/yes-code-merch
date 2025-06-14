import type { Session } from '@supabase/supabase-js';

export interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}
