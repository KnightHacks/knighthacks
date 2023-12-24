import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Redirect } from "wouter";

import type { RouterOutput } from "@knighthacks/api";
import { insertHackerRequestSchema } from "@knighthacks/db";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/trpc";

export function HackathonRegistration() {
  const { data: currentUser, isLoading } = trpc.users.getCurrentUser.useQuery();

  if (isLoading) {
    return <>Fetching current user...</>;
  }

  if (!currentUser) return <Redirect to="/hackathon/account-registration" />;

  return <HackerRegistration currentUser={currentUser} />;
}

type HackerRegistrationSchema = z.infer<typeof insertHackerRequestSchema>;

function HackerRegistration({
  currentUser,
}: {
  currentUser: NonNullable<RouterOutput["users"]["getCurrentUser"]>;
}) {
  const utils = trpc.useUtils();
  const { mutate, isLoading, isSuccess } = trpc.hackers.register.useMutation({
    onSuccess: () => {
      void utils.users.getCurrentUser.invalidate();
    },
  });
  const form = useForm<HackerRegistrationSchema>({
    resolver: zodResolver(insertHackerRequestSchema),
  });

  const onSubmit: SubmitHandler<HackerRegistrationSchema> = (data) => {
    mutate({
      ...data,
    });
  };

  if (currentUser.hasAppliedToCurrentHackathon || isSuccess) {
    return <>Thank you for registering!</>;
  }

  if (isLoading) {
    return <>Registering...</>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto  flex w-2/3 flex-1 flex-col justify-center space-y-6"
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
