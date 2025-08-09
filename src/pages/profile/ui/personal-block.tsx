import { Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';

import { ROUTES } from '@shared/config/routes';
import { getLinkButtonClass } from '@shared/ui/link-button';

type PerosnalBlockProps = {
  firstName: string;
  lastName: string;
  email: string;
};

export const PersonalBlock = ({
  firstName,
  lastName,
  email,
}: PerosnalBlockProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-4">
        <h2>
          {firstName} {lastName}
        </h2>
        <p className="text-base text-muted-foreground">{email}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Link
          to={ROUTES.PROFILE_PERSONAL}
          className={getLinkButtonClass('outline', 'lg')}
        >
          <Pencil className="mr-1.5" />
          Edit profile
        </Link>
        <Link
          to={ROUTES.PROFILE_SECRET}
          className={getLinkButtonClass('outline', 'lg')}
        >
          Change password
        </Link>
      </div>
    </div>
  );
};
