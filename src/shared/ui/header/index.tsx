import { Link } from '@tanstack/react-router';

import logo from '@shared/assets/header-logo-sprite.svg';
import { Categories } from '@shared/ui/categories';
import { PhoneWidget } from '@shared/ui/phone-widget';

import { ROUTES } from '@/shared/routing/types';

import { Banner } from './banner';
import { UserMenu } from './user-menu';

export const Header = (): React.JSX.Element => {
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
            <Banner category="T-Shirts" />
            <PhoneWidget />
          </div>
          <div className="h-full">
            <nav className="flex gap-4 grow-1 justify-end items-center text-2xl">
              <Link to={ROUTES.ABOUT}>About Us</Link>
              <UserMenu />
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-foreground h-17 flex items-center pl-11">
        <Categories />
      </div>
    </header>
  );
};
