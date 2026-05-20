import { cva } from 'class-variance-authority';

import icon from '@shared/assets/subtract.svg';
import { cn } from '@shared/lib/utils';

type BannerProps = {
  children: React.ReactNode;
  variant?: 'default' | 'mobile';
  className?: string;
};

const bannerVariants = cva('flex gap-2 transition-all', {
  variants: {
    variant: {
      default: 'grow items-center',
      mobile:
        'flex-col w-full max-w-[300px] items-center text-center mx-auto border-t-2 border-primary pt-8',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const Banner = ({
  children,
  variant,
  className,
}: BannerProps): React.JSX.Element => {
  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      <img src={icon} width={28} height={28} alt="discount icon" />
      <p className="text-xl">{children}</p>
    </div>
  );
};
