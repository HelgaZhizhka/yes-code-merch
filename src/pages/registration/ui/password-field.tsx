import { useCallback, useState } from 'react';

import { PasswordInput } from '@shared/ui/password-input';

import {
  PASSWORD_STRENGTH,
  getPasswordFeedback,
  getPasswordStrengthColor,
} from '../model/validation-schema';

interface PasswordFieldProps {
  value: string;
  error?: string;
  onChange(value: string | React.ChangeEvent<HTMLInputElement>): void;
}

export const PasswordField = ({
  value,
  onChange,
  error,
}: PasswordFieldProps): React.JSX.Element => {
  const [isFocused, setIsFocused] = useState(false);
  const { strength, message } = getPasswordFeedback(value ?? '');

  const showFeedback = (value?.length ?? 0) > 0 || isFocused;

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <div className="space-y-2">
      <PasswordInput
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={error ? 'border-red-500' : ''}
        placeholder="Enter your password"
      />

      {showFeedback && (
        <div className="space-y-2">
          <div className="flex gap-1 h-1">
            <div
              className={`h-full w-1/3 ${strength === PASSWORD_STRENGTH.LOW || strength === PASSWORD_STRENGTH.MEDIUM || strength === PASSWORD_STRENGTH.HIGH ? getPasswordStrengthColor(PASSWORD_STRENGTH.LOW) : 'bg-gray-200'}`}
            ></div>
            <div
              className={`h-full w-1/3 ${strength === PASSWORD_STRENGTH.MEDIUM || strength === PASSWORD_STRENGTH.HIGH ? getPasswordStrengthColor(PASSWORD_STRENGTH.MEDIUM) : 'bg-gray-200'}`}
            ></div>
            <div
              className={`h-full w-1/3 ${strength === PASSWORD_STRENGTH.HIGH ? getPasswordStrengthColor(PASSWORD_STRENGTH.HIGH) : 'bg-gray-200'}`}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
