import { useCallback, useState } from 'react';

import { PasswordInput } from '@shared/ui/password-input';

import {
  STRENGTH,
  getPasswordFeedback,
  getPasswordStrengthColor,
} from './model/validation-schema';

interface PasswordFieldProps {
  readonly value: string;
  readonly error?: string;
  readonly name?: string;
  readonly id?: string;
  readonly ref?: React.RefObject<HTMLInputElement>;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

export const PasswordField = ({
  value,
  onChange,
  name,
  id,
  ref,
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
        name={name}
        value={value}
        id={id}
        ref={ref}
        onChange={(event) => onChange(event)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="new-password"
        className={error ? 'border-red-500' : ''}
        placeholder="Enter your password"
      />

      {showFeedback && (
        <div className="space-y-2">
          <div className="flex gap-1 h-1">
            <div
              className={`h-full w-1/3 ${strength === STRENGTH.LOW || strength === STRENGTH.MEDIUM || strength === STRENGTH.HIGH ? getPasswordStrengthColor(STRENGTH.LOW) : 'bg-gray-200'}`}
            ></div>
            <div
              className={`h-full w-1/3 ${strength === STRENGTH.MEDIUM || strength === STRENGTH.HIGH ? getPasswordStrengthColor(STRENGTH.MEDIUM) : 'bg-gray-200'}`}
            ></div>
            <div
              className={`h-full w-1/3 ${strength === STRENGTH.HIGH ? getPasswordStrengthColor(STRENGTH.HIGH) : 'bg-gray-200'}`}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      )}
    </div>
  );
};
