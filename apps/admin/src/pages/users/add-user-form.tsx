import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

const insertUserFormSchema = insertUserSchema.omit({ id: true });

type InsertUserFormValues = z.infer<typeof insertUserFormSchema>;

export function AddUserForm() {
  const utils = trpc.useUtils();
  const { mutate, isLoading } = trpc.users.add.useMutation({
    onSuccess: async () => {
      await utils.users.getAll.invalidate();
      toast("Success!", {
        description: "User added",
      });
    },
  });
  const form = useForm<InsertUserFormValues>({
    resolver: zodResolver(insertUserFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit: SubmitHandler<InsertUserFormValues> = (values) => {
    mutate(values);
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Add User
        </Button>
      </form>
    </Form>
  );
}
