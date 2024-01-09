import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { insertHackathonSchema } from "@knighthacks/db";

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

const insertHackathonFormSchema = insertHackathonSchema.omit({ id: true });

type InsertHackathonFormValues = z.infer<typeof insertHackathonFormSchema>;

export function AddHackathonForm() {
  const utils = trpc.useUtils();
  const { mutate, isLoading } = trpc.hackathons.createHackathon.useMutation({
    onSuccess: async () => {
      await utils.hackathons.getCurrentHackathon.invalidate();
      toast("Success!", { description: "Hackathon added" });
    },
  });
  const form = useForm<InsertHackathonFormValues>({
    resolver: zodResolver(insertHackathonFormSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit: SubmitHandler<InsertHackathonFormValues> = (values) => {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hackathon Name</FormLabel>
              <FormControl>
                <Input placeholder="Hackathon Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Start Date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" placeholder="End Date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Add Hackathon
        </Button>
      </form>
    </Form>
  );
}
