import { Spinner } from '@shared/ui/spinner';

export const Loader = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <Spinner className="text-violet" size="large" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
