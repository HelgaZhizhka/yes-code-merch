import React from 'react';
import type {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form';

interface FormFieldWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  readonly control: Control<TFieldValues>;
  readonly name: TName;
  readonly label?: string;
  readonly labelPosition?: 'top' | 'right';
  readonly children: (
    field: ControllerRenderProps<TFieldValues, TName>
  ) => React.ReactNode;
}
const getFormItemClassName = (
  hasLabel: boolean,
  position: 'top' | 'right'
): string => {
  if (!hasLabel) return '';
  return position === 'right' ? 'flex flex-row items-center gap-2' : '';
};

export function FormFieldWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  children,
  labelPosition = 'top',
}: FormFieldWrapperProps<TFieldValues, TName>): React.JSX.Element {
  const renderFieldContent = (
    field: ControllerRenderProps<TFieldValues, TName>
  ): React.ReactNode => {
    if (!label) return <FormControl>{children(field)}</FormControl>;

    if (labelPosition === 'right') {
      return (
        <>
          <FormControl>{children(field)}</FormControl>
          <FormLabel className="mb-0">{label}</FormLabel>
        </>
      );
    }

    return (
      <>
        <FormLabel>{label}</FormLabel>
        <FormControl>{children(field)}</FormControl>
      </>
    );
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={getFormItemClassName(!!label, labelPosition)}>
          {renderFieldContent(field)}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
