import { CalendarIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { cn } from '@shared/lib/utils';
import { Button } from '@shared/ui/button';
import { Calendar } from '@shared/ui/calendar';
import { Input } from '@shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover';

interface InputDatepickerProps {
  readonly value: string | undefined;
  readonly name?: string;
  readonly id?: string;
  readonly ref?: React.RefObject<HTMLInputElement>;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const InputDatepicker = ({
  value,
  name,
  id,
  ref,
  onChange,
  placeholder = 'Select a date',
  disabled = false,
  className = '',
}: InputDatepickerProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      onChange(formatDate(date));
      setOpen(false);
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown' && !disabled) {
        setOpen(true);
      }
    },
    [disabled]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          type="date"
          className={cn(
            className,
            'cursor-pointer',
            'disabled:cursor-not-allowed',
            '[-webkit-appearance:textfield] [&::-webkit-calendar-picker-indicator]:hidden'
          )}
          id={id}
          ref={ref}
          value={value ?? ''}
          name={name}
          autoComplete="off"
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant="ghost"
              type="button"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              defaultMonth={value ? new Date(value) : undefined}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
