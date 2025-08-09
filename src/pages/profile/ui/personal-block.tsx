import { Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';

import { ROUTES } from '@shared/config/routes';
import { Avatar, AvatarFallback } from '@shared/ui//avatar';
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
      <div className="flex flex-row gap-4 justify-center items-center">
        <Avatar>
          <AvatarFallback>
            {firstName[0]}
            {lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h2>
            {firstName} {lastName}
          </h2>
          <p className="text-base text-muted-foreground">{email}</p>
        </div>
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
