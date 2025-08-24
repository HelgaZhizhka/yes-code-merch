import { LogOut } from 'lucide-react';

import { LayoutView, type LayoutViewType } from '@shared/types';

interface LogoutButtonProps {
  variant: LayoutViewType;
  onLogout(): void;
}

export const LogoutButton = ({
  variant,
  onLogout,
}: LogoutButtonProps): React.JSX.Element =>
  variant === LayoutView.FOOTER ? (
    <button
      className="text-violet-foreground hover:text-primary-foreground"
      onClick={onLogout}
    >
      Logout
    </button>
  ) : (
    <button className="p-0 m-0 bg-none border-none" onClick={onLogout}>
      <LogOut className="w-9 h-9 text-primary-foreground" />
    </button>
  );
