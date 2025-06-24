import { useEffect } from 'react';

import { initSession } from '@entities/session/lib/init-session';

export const useInitSession = () => {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    initSession().then((unsub) => {
      unsubscribe = unsub;
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
};
