import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { TanStackQueryLayout } from '@shared/api/tanstack-query';
import { Footer } from '@shared/ui/footer';
import { Header } from '@shared/ui/header';
import { Toaster } from '@shared/ui/sonner';

import { useAuth } from '@/entities/session/hooks';

export const Layout = (): React.JSX.Element => {
  const { isAuthorized, isLoaded, handleLogout } = useAuth();

  return (
    <>
      <Header
        isAuthorized={isAuthorized}
        isLoaded={isLoaded}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer
        isAuthorized={isAuthorized}
        isLoaded={isLoaded}
        onLogout={handleLogout}
      />
      <Toaster />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  );
};
