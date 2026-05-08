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
    <button
      type="button"
      aria-label="Logout"
      className="p-0 m-0 bg-transparent border-0"
      onClick={onLogout}
    >
      <LogOut className="w-7 h-7 text-primary-foreground" />
    </button>
  );
