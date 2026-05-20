import { Link } from '@tanstack/react-router';
import { Phone, ShoppingCart } from 'lucide-react';
import { Suspense } from 'react';

import type { AuthProps } from '@shared/api';
import logo from '@shared/assets/header-logo-sprite.svg';
import { ROUTES } from '@shared/config/routes';
import { AuthMenu } from '@shared/ui/auth-menu';
import { ContactWidget } from '@shared/ui/contact-widget';
import { ThemeSwitcher } from '@shared/ui/theme-switcher';

interface HeaderProps extends AuthProps {
  mobileMenu?: React.ReactNode;
  banner?: React.ReactNode;
  onLogout(): Promise<void>;
}

export const Header = ({
  isLoading,
  isGuest,
  isAuthenticated,
  isError,
  onLogout,
  mobileMenu,
  banner,
}: HeaderProps): React.JSX.Element => {
  return (
    <header className="flex h-16 items-center gap-4 px-4 border-b border-border min-[1020px]:h-20 min-[1020px]:px-8 min-[1120px]:h-25 min-[1120px]:px-11">
      <div className="flex items-center gap-3">
        {mobileMenu && <div className="min-[1020px]:hidden">{mobileMenu}</div>}
        <Link
          to={ROUTES.HOME}
          className="flex items-center text-foreground"
          aria-label="Yes Code Merch — home"
        >
          <svg
            viewBox="0 0 161 94"
            className="hidden h-12 w-auto min-[1120px]:block"
            aria-hidden="true"
          >
            <use href={`${logo}#logo`}></use>
          </svg>
          <svg
            viewBox="0 0 116 100"
            className="block h-10 w-auto min-[1120px]:hidden"
            aria-hidden="true"
          >
            <use href={`${logo}#face-logo`}></use>
          </svg>
        </Link>
      </div>

      <div className="hidden flex-1 items-center justify-center min-[1020px]:flex">
        {banner && <Suspense fallback={null}>{banner}</Suspense>}
        <ContactWidget
          icon={<Phone className="h-6" />}
          label="(+971) 58 8284186"
          href="tel:971588284186"
        />
      </div>

      <nav className="ml-auto flex items-center gap-4 min-[1020px]:ml-0">
        <AuthMenu
          isLoading={isLoading}
          isGuest={isGuest}
          isAuthenticated={isAuthenticated}
          isError={isError}
          onLogout={onLogout}
        />
        <Link
          to={ROUTES.CART}
          className="flex items-center text-foreground"
          aria-label="Cart"
        >
          <ShoppingCart className="h-7 w-7" aria-hidden="true" />
        </Link>
        <ThemeSwitcher />
      </nav>
    </header>
  );
};
