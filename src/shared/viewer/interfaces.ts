import type { Session, User } from '@supabase/supabase-js';

export interface RegistrationResult {
  session: Session | null;
  user: User | null;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegistrationDTO {
  email: string;
  password: string;
}
