import { useTheme } from '@shared/theme/hooks';
import {
  useInitViewer,
  useStatus,
  ViewerStatus,
  type ViewerStatusType,
} from '@shared/viewer';

interface AppInitResult {
  isAppReady: boolean;
  context: {
    status: ViewerStatusType;
  };
}

export const useAppInit = (): AppInitResult => {
  const status = useStatus();

  useInitViewer();
  useTheme();

  return {
    isAppReady:
      status === ViewerStatus.AUTHENTICATED || status === ViewerStatus.GUEST,
    context: {
      status,
    },
  };
};
