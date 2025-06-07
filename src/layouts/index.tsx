import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { TanStackQueryLayout } from '@shared/api/tanstack-query';

import { Footer } from '@/shared/ui/footer';
import { Header } from '@/shared/ui/header';

export const Layout = (): React.JSX.Element => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  );
};
