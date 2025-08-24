import { useNavigate } from '@tanstack/react-router';

import { ROUTES } from '@shared/config/routes';
import { Button } from '@shared/ui/button';

export const ErrorPage = ({ error }: { error: Error }): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col items-center justify-center m-auto">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full flex flex-col items-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-destructive"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">
          Oops! Something went wrong
        </h1>
        <p className="text-destructive mb-6 text-center">{error.message}</p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => location.reload()}
        >
          Retry
        </Button>
        or
        <Button
          onClick={() => navigate({ to: ROUTES.HOME })}
          className="w-full"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};
