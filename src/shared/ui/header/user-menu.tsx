import { ROUTES } from '@/shared/routing/types';
import { Link } from '@tanstack/react-router';
import { Button } from '@shared/ui/button';
import { ShoppingCart } from 'lucide-react';

export const UserMenu = (): React.JSX.Element => {
  const isAuthenticated = false;

  return (
    <nav className="flex gap-4 text-inherit">
      {isAuthenticated && <Link to={ROUTES.PROFILE}>Profile</Link>}
      {!isAuthenticated && (
        <Button variant={'outline'} size={'lg'}>
          <Link to={ROUTES.LOGIN} className="text-primary-foreground text-xl">
            Sign in
          </Link>
        </Button>
      )}
      {!isAuthenticated && (
        <Button variant={'default'} size={'lg'}>
          <Link
            to={ROUTES.REGISTRATION}
            className="text-primary-foreground text-xl"
          >
            Sign up
          </Link>
        </Button>
      )}
      <Link to={ROUTES.CART} className="flex items-center">
        <ShoppingCart
          className="w-9 h-9 text-primary-foreground"
          role="img"
          aria-label="Cart icon"
        />
      </Link>
    </nav>
  );
};
