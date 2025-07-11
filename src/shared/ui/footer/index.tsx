import { Link } from '@tanstack/react-router';
import { Mail, MessageCircle, Phone } from 'lucide-react';

import Logo from '@shared/assets/logo.svg';
import { ROUTES } from '@shared/config/routes';
import { LayoutView } from '@shared/types';
import { AuthMenu } from '@shared/ui/auth-menu';
import { Categories } from '@shared/ui/categories';
import { ContactWidget } from '@shared/ui/contact-widget';
import type { AuthProps } from '@shared/viewer';

interface FooterProps extends AuthProps {
  onLogout(): Promise<void>;
}

export const Footer = ({
  isLoading,
  isGuest,
  isAuthenticated,
  onLogout,
}: FooterProps): React.JSX.Element => {
  return (
    <footer className="bg-violet text-violet-foreground">
      <div className="container max-w-screen-xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-8">
        <div className="flex flex-col gap-1">
          <Link to={ROUTES.HOME}>
            <img src={Logo} alt="YesCode Logo" className="w-24" />
          </Link>
          <h1 className="text-base mt-2">YesCode: Merch for True Coders</h1>
          <nav className="flex flex-col gap-1">
            <Link
              to={ROUTES.ABOUT}
              className="text-violet-foreground hover:text-primary-foreground"
            >
              About Us
            </Link>
            <AuthMenu
              isLoading={isLoading}
              isGuest={isGuest}
              isAuthenticated={isAuthenticated}
              onLogout={onLogout}
              variant={LayoutView.FOOTER}
            />
          </nav>
        </div>
        <div className="hidden md:block">
          <h5 className="font-bold mb-2">Categories</h5>
          <Categories variant={LayoutView.FOOTER} />
        </div>

        <div>
          <h5 className="font-bold mb-2">Contact us</h5>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <ContactWidget
                icon={<Phone className="w-5 h-5" />}
                label="(+971) 58 8284186"
                href="tel:971588284186"
                variant={LayoutView.FOOTER}
              />
            </li>
            <li className="flex items-center gap-2">
              <ContactWidget
                icon={<MessageCircle className="w-5 h-5" />}
                label="(+971) 58 8284186"
                variant={LayoutView.FOOTER}
              />
            </li>
            <li className="flex items-center gap-2">
              <ContactWidget
                icon={<Mail className="w-5 h-5" />}
                label="yescode@gmail.com"
                href="mailto:yescode@gmail.com"
                variant={LayoutView.FOOTER}
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-dark-background text-violet-foreground text-center py-3 text-xs">
        © {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
};
