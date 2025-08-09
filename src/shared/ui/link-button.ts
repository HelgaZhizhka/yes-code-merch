import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@shared/lib/utils';

export const linkButtonVariants = cva(
  "transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          'inline-flex items-center justify-center whitespace-nowrap h-10 font-medium px-6 rounded-md shadow-xs bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'inline-flex items-center justify-center whitespace-nowrap h-10 font-medium px-6 rounded-md shadow-xs text-primary-foreground border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        white: 'text-violet-foreground hover:text-violet-accent-foreground',
        ghost:
          'flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      size: {
        sm: 'text-sm',
        lg: 'text-lg',
        xl: 'text-xl',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'xl',
    },
  }
);

export type LinkButtonVariants = VariantProps<typeof linkButtonVariants>;

export const getLinkButtonClass = (
  variant?: LinkButtonVariants['variant'],
  size?: LinkButtonVariants['size']
) => cn(linkButtonVariants({ variant, size }));
