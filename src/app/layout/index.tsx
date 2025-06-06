import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header';

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
