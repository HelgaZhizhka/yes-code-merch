import { useNavigate } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { Button } from '@shared/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 gap-4">
      <h2 className="text-xl font-bold text-center text-destructive">
        Error loading catalog
      </h2>
      <p className="text-foreground text-center max-w-md">{error.message}</p>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Button variant="outline" onClick={resetErrorBoundary}>
          Retry
        </Button>
        <Button onClick={() => navigate({ to: ROUTES.HOME })}>
          Go to Home
        </Button>
      </div>
    </div>
  );
};
