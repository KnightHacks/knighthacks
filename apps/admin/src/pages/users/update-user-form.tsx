import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { RouterOutput } from "@knighthacks/api";
import { insertUserSchema } from "@knighthacks/db";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { trpc } from "~/trpc";

type User = RouterOutput["users"]["getAll"][number];

const updateUserFormSchema = insertUserSchema.omit({ id: true, email: true });

type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;

export function UpdateUserForm({ user }: { user: User }) {
  const utils = trpc.useUtils();

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  const { mutate, isLoading } = trpc.users.update.useMutation({
    onSuccess: async () => {
      await utils.users.getAll.invalidate();
      toast("Success!", {
        description: "User updated",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<UpdateUserFormValues> = (values) => {
    mutate({
      id: user.id,
      ...values,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
        <Button type="submit" disabled={isLoading}>
          Update User
        </Button>
      </form>
    </Form>
  );
}
