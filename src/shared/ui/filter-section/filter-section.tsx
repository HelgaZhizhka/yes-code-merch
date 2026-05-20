import { ChevronRight } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

import { cn } from '@shared/lib/utils';

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export const FilterSection = ({
  title,
  defaultOpen = true,
  children,
  className,
}: FilterSectionProps): React.JSX.Element => {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <div className={cn('border-t border-border', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center justify-between py-3 text-left text-[13px] font-bold tracking-wide uppercase text-foreground"
      >
        <span>{title}</span>
        <ChevronRight
          className={cn(
            'h-3.5 w-3.5 text-muted-foreground transition-transform',
            open && 'rotate-90 text-primary'
          )}
          aria-hidden
        />
      </button>
      <div
        id={bodyId}
        aria-hidden={!open}
        className={cn('pb-3.5', !open && 'hidden')}
      >
        {children}
      </div>
    </div>
  );
};
