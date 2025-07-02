import { supabase } from '@shared/api/supabase-client';
import { setSession } from '@shared/session/model';

export const initSession = async () => {
  const { data } = await supabase.auth.getSession();
  setSession(data.session ?? null);

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session ?? null);
  });

  return () => {
    subscription.unsubscribe();
  };
};
