import { useState } from 'react';

import { PasswordInput } from '@shared/ui/password-input';

import type { PasswordStrength } from '../model/validation-schema';
import { getPasswordFeedback } from '../model/validation-schema';

interface PasswordFieldProps {
  value: string;
  error?: string;
  onChange(value: string | React.ChangeEvent<HTMLInputElement>): void;
}

const getStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case 'low': {
      return 'bg-red-500';
    }
    case 'medium': {
      return 'bg-yellow-500';
    }
    case 'high': {
      return 'bg-green-500';
    }
    default: {
      return 'bg-gray-200';
    }
  }
};
export const PasswordField = ({
  value,
  onChange,
  error,
}: PasswordFieldProps): React.JSX.Element => {
  const [isFocused, setIsFocused] = useState(false);
  const { strength, message } = getPasswordFeedback(value ?? '');

  const showFeedback = (value?.length ?? 0) > 0 || isFocused;

  return (
    <div className="space-y-2">
      <PasswordInput
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={error ? 'border-red-500' : ''}
        placeholder="Enter your password"
      />

      {showFeedback && (
        <div className="space-y-2">
          <div className="flex gap-1 h-1">
            <div
              className={`h-full w-1/3 ${strength === 'low' || strength === 'medium' || strength === 'high' ? getStrengthColor('low') : 'bg-gray-200'}`}
            ></div>
            <div
              className={`h-full w-1/3 ${strength === 'medium' || strength === 'high' ? getStrengthColor('medium') : 'bg-gray-200'}`}
            ></div>
            <div
              className={`h-full w-1/3 ${strength === 'high' ? getStrengthColor('high') : 'bg-gray-200'}`}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
