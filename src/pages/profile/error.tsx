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
    <div className="min-h-[300px] flex flex-col items-center justify-center p-8 m-auto">
      <h2 className="text-xl font-bold mb-2 text-center text-destructive">
        Error loading profile data
      </h2>
      <p className="text-foreground mb-6 text-center">{error.message}</p>
      <Button variant="outline" onClick={resetErrorBoundary} className="w-full">
        Retry
      </Button>
      or
      <Button onClick={() => navigate({ to: ROUTES.HOME })} className="w-full">
        Go to Home
      </Button>
    </div>
  );
};
