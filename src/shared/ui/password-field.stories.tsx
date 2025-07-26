import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JSX, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { newPasswordSchema } from '@shared/lib/schemas';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';

import { PasswordField } from './password-field';

const meta = {
  title: 'shared/ui/form/password-field',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveValidationDemo = <T,>({
  label,
  initialValue,
  schema,
  renderInput,
  showValue = false,
}: {
  label: string;
  initialValue: T;
  schema: z.ZodType<T>;
  renderInput: (value: T, onChange: (value: T) => void) => ReactNode;
  showValue?: boolean;
}): JSX.Element => {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    try {
      schema.parse(value);
      setError(undefined);
    } catch (error_) {
      if (error_ instanceof z.ZodError) {
        setError(error_?.issues[0].message);
      }
    }
  }, [value, schema]);

  const handleChange = (newValue: T): void => {
    setValue(newValue);
  };

  const handleReset = (): void => {
    setValue(initialValue);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        {showValue && (
          <pre className="text-xs bg-gray-100 p-1 rounded">
            {JSON.stringify(value, null, 2)}
          </pre>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {renderInput(value, handleChange)}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="mt-2"
        >
          Reset
        </Button>
      </CardContent>
    </Card>
  );
};

export const PasswordStrength: Story = {
  render: () => (
    <div className="space-y-6">
      <InteractiveValidationDemo
        label="Interactive Password Validation"
        initialValue=""
        schema={newPasswordSchema.shape.password}
        renderInput={(value, onChange) => (
          <PasswordField
            value={value}
            onChange={(v) => {
              if (typeof v === 'string') {
                onChange(v);
              } else if (v && typeof v === 'object' && 'target' in v) {
                onChange((v.target as HTMLInputElement).value);
              }
            }}
          />
        )}
      />
    </div>
  ),
};
