"use client";

import { useRouter } from "next/navigation";

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
import { Textarea } from "@knighthacks/ui/textarea";
import { toast } from "@knighthacks/ui/toast";
import { CreateHackerSchema } from "@knighthacks/validators";

import { trpc } from "~/trpc";

export function SurveyForm({ userId }: { userId: string }) {
  const form = useForm({
    schema: CreateHackerSchema,
    defaultValues: {
      hackathonId: 1,
      userId,
      whyAttend: "",
      whatLearn: "",
    },
  });
  const utils = trpc.useUtils();

  const router = useRouter();
  const registerHacker = trpc.hacker.create.useMutation({
    onSuccess: async () => {
      await utils.user.current.invalidate();
      toast("Success!", {
        description: "Created user profile",
      });
      router.refresh();
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  console.log(form.formState.errors);

  return (
    <div className="mx-auto w-full max-w-screen-sm px-8 pb-8 pt-20">
      <h1 className="mb-2 text-center text-2xl font-bold">
        KnightHacks 2024 Application
      </h1>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (data) => {
            registerHacker.mutate(data);
          })}
        >
          <FormField
            control={form.control}
            name="whyAttend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Why do you want to attend KnightHacks?"
                    {...field}
                    value={field.value}
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
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What do you hope to learn at KnightHacks?"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
