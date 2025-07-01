import { Link } from '@tanstack/react-router';
import { Phone, ShoppingCart } from 'lucide-react';

import logo from '@shared/assets/header-logo-sprite.svg';
import { SaleCategoryName } from '@shared/config';
import { ROUTES } from '@shared/config/routes';
import { AuthMenu } from '@shared/ui/auth-menu';
import { Categories } from '@shared/ui/categories';
import { ContactWidget } from '@shared/ui/contact-widget';
import { ThemeSwitcher } from '@shared/ui/theme-switcher';
import { useAuth } from '@shared/viewer/hooks';

import { Banner } from './banner';

export const Header = (): React.JSX.Element => {
  const { isAuthorized, isLoaded, handleLogout } = useAuth();

  return (
    <header className="flex flex-col">
      <div className="flex justify-between items-center gap-25 p-5 pl-11 pr-11">
        <Link to={ROUTES.HOME}>
          <svg
            className="h-24 w-40 text-foreground"
            role="img"
            aria-label="Yes Code Merch logo"
          >
            <use href={`${logo}#logo`}></use>
          </svg>
        </Link>
        <div className="flex flex-col gap-4 grow-1">
          <div className="flex justify-between w-full grow-1">
            <Banner category={SaleCategoryName} />
            <div className="h-10 flex justify-end items-center text-xl gap-2">
              <ContactWidget
                icon={<Phone className="h-8" />}
                label="(+971) 58 8284186"
                href="tel:971588284186"
              />
            </div>
          </div>
          <div className="h-full">
            <nav className="flex gap-4 grow-1 justify-end items-center text-2xl">
              <Link to={ROUTES.ABOUT}>About Us</Link>
              <AuthMenu
                isAuthorized={isAuthorized}
                isLoaded={isLoaded}
                onLogout={handleLogout}
              />
              <Link to={ROUTES.CART} className="flex items-center">
                <ShoppingCart
                  className="w-9 h-9 text-primary-foreground"
                  role="img"
                  aria-label="Shopping cart icon"
                />
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-dark-background h-17 flex items-center pl-11 pr-11 justify-between">
        <Categories />
        <ThemeSwitcher />
      </div>
    </header>
  );
};
