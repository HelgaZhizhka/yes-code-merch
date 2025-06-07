import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { Footer } from '@app/components/footer';
import { Header } from '@app/components/header';

import { TanStackQueryLayout } from '@shared/api/tanstack-query';

const App = (): React.JSX.Element => {
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

export default App;
