import type { RouterOutput } from "@knighthacks/api";
import { Button } from "@knighthacks/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@knighthacks/ui/form";
import { Input } from "@knighthacks/ui/input";
import { toast } from "@knighthacks/ui/toast";
import { UpdateUserSchema } from "@knighthacks/validators";

import { api } from "~/trpc";

export function UpdateUserForm({
  user,
}: {
  user: NonNullable<RouterOutput["user"]["all"][number]>;
}) {
  const utils = api.useUtils();

  const form = useForm({
    schema: UpdateUserSchema,
    defaultValues: {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const updateUser = api.user.update.useMutation({
    onSuccess: async () => {
      await utils.user.all.invalidate();
      toast("Success!", {
        description: "Updated user",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          updateUser.mutate(data);
        })}
        className="flex flex-col justify-center space-y-6"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
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
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update User</Button>
      </form>
    </Form>
  );
}
