import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { TanStackQueryLayout } from '@shared/api/tanstack-query';
import { Footer } from '@shared/ui/footer';
import { Header } from '@shared/ui/header';
import { Toaster } from '@shared/ui/sonner';

import { useAuth } from './hooks';

export const Layout = (): React.JSX.Element => {
  const { isLoading, isGuest, isAuthenticated, handleLogout } = useAuth();

  return (
    <>
      <Header
        isLoading={isLoading}
        isGuest={isGuest}
        isAuthenticated={isAuthenticated}
        logout={handleLogout}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer
        isLoading={isLoading}
        isGuest={isGuest}
        isAuthenticated={isAuthenticated}
        logout={handleLogout}
      />
      <Toaster />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  );
};
