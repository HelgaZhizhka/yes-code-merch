import Logo from '@shared/assets/logo.svg';
import { ROUTES } from '@shared/model/constants';
import { Link } from '@tanstack/react-router';

import { Mail, MessageCircle, Phone } from 'lucide-react';

export const Footer = (): React.JSX.Element => {
  return (
    <footer className="bg-violet text-violet-foreground">
      <div className="container max-w-screen-xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-8">
        <div className="flex flex-col gap-1">
          <Link to={ROUTES.HOME}>
            <img src={Logo} alt="YesCode Logo" className="w-24" />
          </Link>
          <h1 className="text-base">YesCode: Merch for True Coders</h1>
          <nav className="flex flex-col gap-1">
            <Link
              to={ROUTES.ABOUT}
              className="text-violet-foreground hover:text-primary-foreground"
            >
              About Us
            </Link>
            <div className="flex gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="text-violet-foreground hover:text-primary-foreground"
              >
                Login
              </Link>
              <span>|</span>
              <Link
                to={ROUTES.REGISTRATION}
                className="text-violet-foreground hover:text-primary-foreground"
              >
                Registration
              </Link>
            </div>
          </nav>
        </div>
        <div className="hidden md:block">
          <h5 className="font-bold mb-2">Categories</h5>
          <ul className="space-y-1">
            <li>
              <Link
                to={ROUTES.CATEGORY}
                params={{
                  categoryId: 'Closes',
                }}
                className="text-violet-foreground hover:text-primary-foreground"
              >
                Closes
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.CATEGORY}
                params={{
                  categoryId: 'Drinkware',
                }}
                className="text-violet-foreground hover:text-primary-foreground"
              >
                Drinkware
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.CATEGORY}
                params={{
                  categoryId: 'Office',
                }}
                className="text-violet-foreground hover:text-primary-foreground"
              >
                Office
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.CATEGORY}
                params={{
                  categoryId: 'Bags',
                }}
                className="text-violet-foreground hover:text-primary-foreground"
              >
                Bags
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-2">Contact us</h5>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <a
                href="tel:+971588284186"
                className="text-violet-foreground hover:text-primary-foreground"
              >
                (+971) 58 8284186
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>(+971) 58 8284186</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <a
                href="mailto:yescode@gmail.com"
                className="text-violet-foreground hover:text-primary-foreground"
              >
                yescode@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-foreground text-violet-foreground text-center py-3 text-xs">
        © {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
};
