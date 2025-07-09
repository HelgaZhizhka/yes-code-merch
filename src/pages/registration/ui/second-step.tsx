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

export const SecondStep = (): React.JSX.Element => {
  const { form, handleBack, handleNextStep } = useFormStep();

  const handleSubmit = (data: unknown) => {
    handleNextStep(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data of birth</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Data of birth" {...field} />
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
