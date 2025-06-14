import { supabase } from '@shared/api/supabase-client';

import { useSessionStore } from '../model/store';

export const initSession = async () => {
  // Асинхронно получаем первую сессию
  const { data } = await supabase.auth.getSession();
  useSessionStore.getState().setSession(data.session);
  console.log(data.session);

  // Подписываемся на изменения сессии
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    useSessionStore.getState().setSession(session);
  });

  // Возвращаем функцию отписки для useEffect cleanup
  return () => {
    subscription.unsubscribe();
  };
};
