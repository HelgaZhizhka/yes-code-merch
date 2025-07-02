import { useInitSession } from '@shared/session/hooks';
import {
  useIsAuthorized,
  useIsSessionLoaded,
  type SessionContext,
} from '@shared/session/model';
import { useTheme } from '@shared/theme/hooks';

interface AppInitResult {
  isAppReady: boolean;
  context: SessionContext;
}

export const useAppInit = (): AppInitResult => {
  useInitSession();
  useTheme();

  const isSessionLoaded = useIsSessionLoaded();
  const isAuthorized = useIsAuthorized();

  return {
    isAppReady: isSessionLoaded,
    context: {
      isSessionLoaded,
      isAuthorized,
    },
  };
};
