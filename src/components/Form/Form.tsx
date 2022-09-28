import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import * as React from 'react';
import { useForm, UseFormReturn, SubmitHandler, UseFormProps, FormProvider } from 'react-hook-form';
import { ZodType, ZodTypeDef } from 'zod';

type FormProps<TFormValues, Schema> = {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
  schema?: Schema;
};

// Black-boxing this: not sure entirely how it's working at a low level
export const Form = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<unknown, ZodTypeDef, unknown>
>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TFormValues, Schema>) => {
  const methods = useForm<TFormValues>({ ...options, resolver: schema && zodResolver(schema) });
  return (
    <FormProvider {...methods}>
      <form className={clsx('space-y-6', className)} onSubmit={methods.handleSubmit(onSubmit)} id={id}>
        {children(methods)}
      </form>
    </FormProvider>
  );
};
