"use client";

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
import { CreateUserSchema } from "@knighthacks/validators";

import { api } from "~/trpc";

export function CreateUserForm() {
  const utils = api.useUtils();
  const createUser = api.user.create.useMutation({
    onSuccess: async () => {
      await utils.user.all.invalidate();
      toast("Success!", {
        description: "Created user",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  const form = useForm({
    schema: CreateUserSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          createUser.mutate(data);
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
        <Button type="submit">Create User</Button>
      </form>
    </Form>
  );
}
