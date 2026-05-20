import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { DiscountBanner } from '@entities/catalog';

import { TanStackQueryLayout } from '@shared/api/tanstack-query';
import { Footer } from '@shared/ui/footer';
import { Header } from '@shared/ui/header';
import { MobileMenu } from '@shared/ui/mobile-menu';
import { Toaster } from '@shared/ui/sonner';

import { useAuth } from './hooks';

export const Layout = (): React.JSX.Element => {
  const { isLoading, isGuest, isAuthenticated, isError, handleLogout } =
    useAuth();

  return (
    <>
      <Header
        isLoading={isLoading}
        isGuest={isGuest}
        isAuthenticated={isAuthenticated}
        isError={isError}
        onLogout={handleLogout}
        mobileMenu={<MobileMenu banner={<DiscountBanner variant="mobile" />} />}
        banner={<DiscountBanner />}
      />
      <main className="flex flex-1">
        <Outlet />
      </main>
      <Footer
        isLoading={isLoading}
        isGuest={isGuest}
        isAuthenticated={isAuthenticated}
        isError={isError}
        onLogout={handleLogout}
      />
      <Toaster />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  );
};
