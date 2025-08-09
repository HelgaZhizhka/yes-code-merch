import { Outlet } from '@tanstack/react-router';

export const Profile = (): React.JSX.Element => {
  return (
    <div className="flex flex-1">
      <Outlet />
    </div>
  );
};
