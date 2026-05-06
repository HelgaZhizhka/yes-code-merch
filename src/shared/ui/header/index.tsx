import { Link } from '@tanstack/react-router';
import { Phone, ShoppingCart } from 'lucide-react';

import type { AuthProps } from '@shared/api';
import logo from '@shared/assets/header-logo-sprite.svg';
import { SaleCategoryName } from '@shared/config';
import { ROUTES } from '@shared/config/routes';
import { AuthMenu } from '@shared/ui/auth-menu';
import { ContactWidget } from '@shared/ui/contact-widget';
import { ThemeSwitcher } from '@shared/ui/theme-switcher';

import { Banner } from './banner';

import { MobileMenu } from '../mobile-menu';

interface HeaderProps extends AuthProps {
  onLogout(): Promise<void>;
}

export const Header = ({
  isLoading,
  isGuest,
  isAuthenticated,
  isError,
  onLogout,
}: HeaderProps): React.JSX.Element => {
  return (
    <header className="flex h-16 items-center gap-4 px-4 min-[1020px]:h-20 min-[1020px]:px-8 min-[1120px]:h-25 min-[1120px]:px-11">
      <div className="flex items-center gap-3">
        <div className="min-[1020px]:hidden">
          <MobileMenu />
        </div>
        <Link
          to={ROUTES.HOME}
          className="flex items-center text-foreground"
          aria-label="Yes Code Merch — home"
        >
          <svg
            viewBox="0 0 161 94"
            className="hidden h-12 w-auto min-[1120px]:block"
            aria-hidden="false"
            focusable="false"
            aria-labelledby="logo-title"
          >
            <title id="logo-title">Yes Code Merch logo</title>
            <use href={`${logo}#logo`}></use>
          </svg>
          <svg
            viewBox="0 0 116 100"
            className="block h-10 w-auto min-[1120px]:hidden"
            aria-hidden="false"
            focusable="false"
            aria-labelledby="face-logo-title"
          >
            <title id="face-logo-title">Yes Code Merch logo</title>
            <use href={`${logo}#face-logo`}></use>
          </svg>
        </Link>
      </div>

      <div className="hidden flex-1 items-center justify-center min-[1020px]:flex">
        <Banner category={SaleCategoryName} />
      </div>

      <div className="hidden items-center gap-2 text-xl min-[1020px]:flex">
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
