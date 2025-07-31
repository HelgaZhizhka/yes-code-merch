import { useCallback, useState } from 'react';

import {
  getPasswordFeedback,
  getPasswordStrengthColor,
  STRENGTH,
} from '@shared/lib/validators';
import { PasswordInput } from '@shared/ui/password-input';

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
        className={error ? 'border-destructive' : ''}
        placeholder="Enter your password"
      />

      {showFeedback && (
        <div className="space-y-2">
          <div className="flex gap-1 h-1">
            <div
              className={`h-full w-1/3 ${strength === STRENGTH.WEEK || strength === STRENGTH.MEDIUM || strength === STRENGTH.HIGH ? getPasswordStrengthColor(STRENGTH.WEEK) : 'bg-muted'}`}
            ></div>
            <div
              className={`h-full w-1/3 ${strength === STRENGTH.MEDIUM || strength === STRENGTH.HIGH ? getPasswordStrengthColor(STRENGTH.MEDIUM) : 'bg-muted'}`}
            ></div>
            <div
              className={`h-full w-1/3 ${strength === STRENGTH.HIGH ? getPasswordStrengthColor(STRENGTH.HIGH) : 'bg-muted'}`}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      )}
    </div>
  );
};
