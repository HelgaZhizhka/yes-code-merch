import { Link, useRouter } from '@tanstack/react-router';
import { LogOut, ShoppingCart, User } from 'lucide-react';

import { ROUTES } from '@shared/config/routes';
import { Button } from '@shared/ui/button';
import { useLogout } from '@shared/viewer/hooks';
import {
  useIsAuthorized,
  useIsSessionLoaded,
} from '@shared/viewer/model/selectors';

export const UserMenu = (): React.JSX.Element => {
  const isAuthorized = useIsAuthorized();
  const isLoaded = useIsSessionLoaded();
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.navigate({ to: ROUTES.HOME });
  };

  if (!isLoaded) {
    return <div className="w-3 h-3 animate-pulse bg-primary rounded-full" />;
  }

  return (
    <nav className="flex gap-4 text-inherit">
      {isAuthorized ? (
        <>
          <Link to={ROUTES.PROFILE}>
            <User
              className="w-9 h-9 text-primary-foreground"
              role="img"
              aria-label="User icon"
            />
          </Link>
          <button
            className="p-0 m-0 bg-none border-none"
            onClick={handleLogout}
          >
            <LogOut
              className="w-9 h-9 text-primary-foreground"
              role="img"
              aria-label="LogOut icon"
            />
          </button>
        </>
      ) : (
        <>
          <Button variant={'outline'} size={'lg'}>
            <Link to={ROUTES.LOGIN} className="text-primary-foreground text-xl">
              Sign in
            </Link>
          </Button>
          <Button size={'lg'}>
            <Link
              to={ROUTES.REGISTRATION}
              className="text-primary-foreground text-xl"
            >
              Sign up
            </Link>
          </Button>
        </>
      )}
      <Link to={ROUTES.CART} className="flex items-center">
        <ShoppingCart
          className="w-9 h-9 text-primary-foreground"
          role="img"
          aria-label="Shopping cart icon"
        />
      </Link>
    </nav>
  );
};
