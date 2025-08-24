import { cva } from 'class-variance-authority';

import { cn } from '@shared/lib/utils';
import { LayoutView, type LayoutViewType } from '@shared/types';

interface PhoneWidgetProps {
  icon: React.JSX.Element;
  label: string;
  href?: string;
  variant?: LayoutViewType;
}

const linkVariants = cva('', {
  variants: {
    variant: {
      header: 'text-primary-foreground hover:text-primary-foreground',
      footer: 'text-violet-foreground hover:text-violet-accent-foreground',
    },
  },
  defaultVariants: {
    variant: 'header',
  },
});

export const ContactWidget = ({
  icon,
  label,
  href,
  variant = LayoutView.HEADER,
}: PhoneWidgetProps): React.JSX.Element => {
  return (
    <>
      {icon}
      {href ? (
        <a href={href} className={cn(linkVariants({ variant }))}>
          {label}
        </a>
      ) : (
        <span>{label}</span>
      )}
    </>
  );
};
