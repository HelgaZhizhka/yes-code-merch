import { Link } from '@tanstack/react-router';

import ErrorImage from '@shared/assets/404.png';
import { cn } from '@shared/lib/utils';
import { ROUTES } from '@shared/routing/types';
import { Button } from '@shared/ui/button';

import styles from './not-found.module.css';

export const NotFound = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="relative flex items-center justify-center">
        <h2
          className={cn(
            'absolute text-9xl sm:text-[15rem] md:text-[25rem] lg:text-[35rem] text-primary pointer-events-none',
            styles['animate-glitch']
          )}
        >
          404
        </h2>
        <img
          src={ErrorImage}
          alt="Not found"
          className="z-10 w-40 sm:w-70 md:w-110 lg:w-160 mt-10 lg:mt-20"
        />
      </div>
      <h3 className="text-center">
        <span className="text-accent">WHOOPS! </span>Page they&apos;re looking
        for could not be found.
      </h3>
      <Button size="lg">
        <Link to={ROUTES.HOME} className="text-primary-foreground text-xl">
          Back to main
        </Link>
      </Button>
    </div>
  );
};
