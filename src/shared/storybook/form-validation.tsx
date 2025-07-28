import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type Resolver,
  type UseFormReturn,
} from 'react-hook-form';
import type { z } from 'zod';

type AnyZodObject = z.ZodObject<z.ZodRawShape>;

type FormValidationProps<TSchema extends AnyZodObject> = {
  schema: TSchema;
  initialValues?: Partial<z.infer<TSchema>>;
  children: (methods: UseFormReturn<z.infer<TSchema>>) => React.ReactNode;
};

export const FormValidation = <TSchema extends AnyZodObject>({
  schema,
  initialValues = {},
  children,
}: FormValidationProps<TSchema>): React.JSX.Element => {
  type FormValues = z.infer<TSchema>;
  const resolver: Resolver<FormValues> = zodResolver(
    schema
  ) as Resolver<FormValues>;

  const methods = useForm<FormValues>({
    resolver,
    defaultValues: initialValues as DefaultValues<FormValues>,
    mode: 'onChange',
  });

  return <FormProvider {...methods}>{children(methods)}</FormProvider>;
};
