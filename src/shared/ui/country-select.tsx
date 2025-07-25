import React from 'react';

import { useCountries } from '@shared/countries/hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';

interface CountrySelectProps {
  readonly value: string | undefined;
  readonly name?: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

export function CountrySelect({
  value,
  name,
  onChange,
  placeholder = 'Select a country',
  disabled = false,
}: CountrySelectProps): React.JSX.Element {
  const countries = useCountries();

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      name={name}
      autoComplete="off"
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
}
