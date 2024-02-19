import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { RouterOutput } from "@knighthacks/api";
import { insertHackerFormSchema } from "@knighthacks/db";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/trpc";

type Hacker = RouterOutput["hackers"]["getAll"][number];

type InsertHackerFormValues = z.infer<typeof insertHackerFormSchema>;

export function UpdateHackerForm({ hacker }: { hacker: Hacker }) {
  const utils = trpc.useUtils();
  const { mutate, isLoading } = trpc.hackers.update.useMutation({
    onSuccess: async () => {
      await utils.hackers.getAll.invalidate();
      toast("Success!", {
        description: "Hacker updated",
      });
    },
  });
  const form = useForm<InsertHackerFormValues>({
    resolver: zodResolver(insertHackerFormSchema),
    defaultValues: {
      id: hacker.id,
      whatLearn: hacker.whatLearn,
      whyAttend: hacker.whyAttend,
      userId: hacker.userId,
      hackathonId: hacker.hackathonId,
      status: hacker.status,
    },
  });

  const onSubmit: SubmitHandler<InsertHackerFormValues> = (values) => {
    mutate({
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
          name="whyAttend"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to attend Knight Hacks?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Why do you want to attend Knight Hacks?"
                  className="resize-none"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatLearn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What do you want to learn at Knight Hacks?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What do you want to learn at Knight Hacks?"
                  className="resize-none"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <HackathonSelect form={form} />
        <UserSelect form={form} />
        <StatusSelect form={form} />
        <Button type="submit" disabled={isLoading}>
          Update Hacker
        </Button>
      </form>
    </Form>
  );
}

function HackathonSelect({
  form,
}: {
  form: ReturnType<typeof useForm<InsertHackerFormValues>>;
}) {
  const {
    data: hackathons,
    isLoading,
    isError,
  } = trpc.hackathons.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading hackathons</div>;
  }

  return (
    <FormField
      control={form.control}
      name="hackathonId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Hackathon</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(parseInt(value));
            }}
            value={field.value.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select hackathon" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {hackathons.map((hackathon) => (
                <SelectItem key={hackathon.id} value={hackathon.id.toString()}>
                  {hackathon.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function UserSelect({
  form,
}: {
  form: ReturnType<typeof useForm<InsertHackerFormValues>>;
}) {
  const { data: users, isLoading, isError } = trpc.users.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading hackathons</div>;
  }

  return (
    <FormField
      control={form.control}
      name="userId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>User</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function StatusSelect({
  form,
}: {
  form: ReturnType<typeof useForm<InsertHackerFormValues>>;
}) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {["applied", "accepted", "waitlisted", "checkedin"].map(
                (status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
