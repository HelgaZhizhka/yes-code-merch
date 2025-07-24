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
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CountrySelect({
  value,
  onChange,
  placeholder = 'Select a country',
  disabled = false,
}: CountrySelectProps): React.JSX.Element {
  const countries = useCountries();

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
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
