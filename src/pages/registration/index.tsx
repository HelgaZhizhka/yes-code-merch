import { Outlet } from '@tanstack/react-router';

export const Registration = (): React.JSX.Element => (
  <div className="flex flex-1 items-center justify-center flex-col">
    <div className="flex flex-col gap-3 max-w-lg p-8 w-full">
      <h2 className="mb-6">Welcome to YesCode!</h2>
      <Outlet />
    </div>
  </div>
);
