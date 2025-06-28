import { useSessionStore } from '@entities/session/model/store';

import { supabase } from '@shared/api/supabase-client';

export const initSession = async () => {
  const { data } = await supabase.auth.getSession();
  useSessionStore.getState().setSession(data.session ?? null);

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    useSessionStore.getState().setSession(session ?? null);
  });

  return () => {
    subscription.unsubscribe();
  };
};
