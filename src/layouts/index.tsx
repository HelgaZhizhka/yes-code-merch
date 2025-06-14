import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';

import { initSession } from '@entities/session/lib/init-session';

import { TanStackQueryLayout } from '@shared/api/tanstack-query';
import { Button } from '@shared/ui/button';
import { Footer } from '@shared/ui/footer';
import { Header } from '@shared/ui/header';

import { useLogout } from '@/features/auth/hooks/use-logout';

export const Layout = (): React.JSX.Element => {
  const logout = useLogout();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      unsubscribe = await initSession();
    })();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Button className="m-4" variant="outline" onClick={logout}>
          Logout
        </Button>
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  );
};
