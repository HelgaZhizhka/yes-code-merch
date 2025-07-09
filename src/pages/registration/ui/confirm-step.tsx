import { Button } from '@shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form';
import { Input } from '@shared/ui/input';

import { useFormStep } from '../hooks';

export const ConfirmStep = (): React.JSX.Element => {
  const { form, handleBack, handleNextStep } = useFormStep();

  const handleSubmit = (data: unknown) => {
    handleNextStep(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="shippingAddresses.streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Street Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4">
          <Button type="submit">Continue</Button>
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
};
