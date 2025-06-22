import { cn } from '@shared/lib/utils';
import { ListsView } from '@shared/model/constants';
import type { ListsViewType } from '@shared/model/types';

interface PhoneWidgetProps {
  icon: React.JSX.Element;
  label: string;
  href?: string;
  variant?: ListsViewType;
}

const linkVariants: Record<ListsViewType, string> = {
  default: 'text-primary-foreground',
  vertical: 'text-violet-foreground hover:underline',
};

export const ContactWidget = ({
  icon,
  label,
  href,
  variant = ListsView.DEFAULT,
}: PhoneWidgetProps): React.JSX.Element => {
  return (
    <>
      {icon}
      {href ? (
        <a href={href} className={cn(linkVariants[variant])}>
          {label}
        </a>
      ) : (
        <span>{label}</span>
      )}
    </>
  );
};
