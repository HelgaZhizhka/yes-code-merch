import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JSX, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { COUNTRIES, MIN_AGE } from '@shared/config';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { PasswordInput } from '@shared/ui/password-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';

import { PasswordField } from './password-field';

import { addressSchema, registrationSchema } from '../model/validation-schema';

const meta = {
  title: 'pages/registration/fields',
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

export const EmailValidation: Story = {
  render: () => (
    <div className="space-y-6">
      <InteractiveValidationDemo
        label="Interactive Email Validation"
        initialValue=""
        schema={registrationSchema.shape.email}
        renderInput={(value, onChange) => (
          <Input
            name="email"
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter email to validate"
          />
        )}
      />
    </div>
  ),
};

export const PasswordStrength: Story = {
  render: () => (
    <div className="space-y-6">
      <InteractiveValidationDemo
        label="Interactive Password Validation"
        initialValue=""
        schema={registrationSchema.shape.password}
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

export const PasswordConfirmation: Story = {
  render: () => {
    const confirmPasswordSchema = registrationSchema
      .pick({
        password: true,
        confirmPassword: true,
      })
      .refine(
        (data) => {
          const { password, confirmPassword } = data;
          return !password || !confirmPassword || password === confirmPassword;
        },
        {
          message: "Passwords don't match",
          path: ['confirmPassword'],
        }
      );

    return (
      <div className="space-y-6">
        <InteractiveValidationDemo
          label="Interactive Password Confirmation"
          initialValue={{ password: '', confirmPassword: '' }}
          schema={confirmPasswordSchema}
          showValue={true}
          renderInput={(value, onChange) => {
            const typedValue = value as {
              password: string;
              confirmPassword: string;
            };
            return (
              <div className="space-y-2">
                <PasswordInput
                  value={typedValue.password}
                  placeholder="Password"
                  name="password"
                  onChange={(e) =>
                    onChange({ ...typedValue, password: e.target.value })
                  }
                />
                <PasswordInput
                  value={typedValue.confirmPassword}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={(e) =>
                    onChange({ ...typedValue, confirmPassword: e.target.value })
                  }
                />
              </div>
            );
          }}
        />
      </div>
    );
  },
};

export const PersonalInfo: Story = {
  render: () => (
    <div className="space-y-6">
      <InteractiveValidationDemo
        label="Interactive First Name"
        initialValue=""
        schema={registrationSchema.shape.firstName}
        renderInput={(value, onChange) => (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter first name"
            name="firstName"
          />
        )}
      />
      <InteractiveValidationDemo
        label="Interactive Last Name"
        initialValue=""
        schema={registrationSchema.shape.lastName}
        renderInput={(value, onChange) => (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter last name"
            name="lastName"
          />
        )}
      />
    </div>
  ),
};

export const DateOfBirthValidation: Story = {
  render: () => {
    const today = new Date();
    const validDate = new Date(today);
    validDate.setFullYear(today.getFullYear() - (MIN_AGE + 5));

    const invalidDate = new Date(today);
    invalidDate.setFullYear(today.getFullYear() - (MIN_AGE - 1));
    return (
      <div className="space-y-6">
        <InteractiveValidationDemo
          label="Interactive Date of Birth"
          initialValue=""
          schema={registrationSchema.shape.dateOfBirth}
          renderInput={(value, onChange) => (
            <Input
              name="dateOfBirth"
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        />
      </div>
    );
  },
};

export const PhoneValidation: Story = {
  render: () => (
    <div className="space-y-6">
      <InteractiveValidationDemo
        label="Interactive Phone Number"
        initialValue=""
        schema={registrationSchema.shape.phone}
        renderInput={(value, onChange) => (
          <Input
            name="phone"
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter phone number"
          />
        )}
      />
    </div>
  ),
};

export const AddressValidation: Story = {
  render: () => {
    return (
      <div className="space-y-6">
        <InteractiveValidationDemo
          label="Interactive Address"
          initialValue={{
            country: '',
            city: '',
            streetName: '',
            streetNumber: '',
            postalCode: '',
          }}
          schema={addressSchema}
          showValue={true}
          renderInput={(value, onChange) => {
            const address = value as {
              country: string;
              city: string;
              streetName: string;
              streetNumber: string;
              postalCode: string;
            };

            return (
              <div className="flex flex-col gap-2">
                <Select
                  name="country"
                  value={address.country}
                  onValueChange={(val: string) =>
                    onChange({ ...address, country: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COUNTRIES).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  name="city"
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    onChange({ ...address, city: e.target.value })
                  }
                  placeholder="City"
                />
                <Input
                  name="streetName"
                  type="text"
                  value={address.streetName}
                  onChange={(e) =>
                    onChange({ ...address, streetName: e.target.value })
                  }
                  placeholder="Street Name"
                />
                <Input
                  name="streetNumber"
                  type="text"
                  value={address.streetNumber}
                  onChange={(e) =>
                    onChange({ ...address, streetNumber: e.target.value })
                  }
                  placeholder="Street Number"
                />
                <Input
                  name="postalCode"
                  type="text"
                  value={address.postalCode}
                  onChange={(e) =>
                    onChange({ ...address, postalCode: e.target.value })
                  }
                  placeholder="Postal Code"
                />
              </div>
            );
          }}
        />
      </div>
    );
  },
};
