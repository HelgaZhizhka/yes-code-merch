import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { useCountries } from '@shared/countries/hooks';
import { cn } from '@shared/lib/utils';
import { Button } from '@shared/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@shared/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover';

interface CountryListProps {
  readonly value: string | undefined;
  readonly name?: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

export const CountryList = ({
  value,
  name,
  onChange,
  placeholder = 'Select a country',
  disabled = false,
}: CountryListProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const countries = useCountries();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          aria-disabled={disabled}
          disabled={disabled}
          className="w-full justify-between"
        >
          {value
            ? countries.find((country) => country.code === value)?.name
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
        sideOffset={4}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command>
          <CommandInput
            name={name}
            placeholder={placeholder}
            className="h-9"
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.code}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {country.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === country.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
