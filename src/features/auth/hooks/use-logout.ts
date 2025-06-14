import { useQueryClient } from '@tanstack/react-query';

import { useSessionStore } from '@entities/session/model/store';

import { supabase } from '@shared/api/supabase-client';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return async () => {
    await supabase.auth.signOut();
    useSessionStore.getState().setSession(null);
    queryClient.clear();
  };
};
