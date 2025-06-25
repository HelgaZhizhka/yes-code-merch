import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { TanStackQueryLayout } from '@shared/api/tanstack-query';
import { Footer } from '@shared/ui/footer';
import { Header } from '@shared/ui/header';
import { Toaster } from '@shared/ui/sonner';

export const Layout = (): React.JSX.Element => (
  <>
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <Toaster />
    <TanStackRouterDevtools />
    <TanStackQueryLayout />
  </>
);
