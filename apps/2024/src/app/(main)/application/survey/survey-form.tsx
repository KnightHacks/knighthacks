"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@knighthacks/ui/button";
import { Checkbox } from "@knighthacks/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@knighthacks/ui/form";
import { Textarea } from "@knighthacks/ui/textarea";
import { toast } from "@knighthacks/ui/toast";
import { HackerApplicationSchema } from "@knighthacks/validators";

import { trpc } from "~/trpc/client";

export function SurveyForm() {
  const form = useForm({
    schema: HackerApplicationSchema,
    defaultValues: {
      survey1: "",
      survey2: "",
      isFirstTime: false,
      isPlinktern: false,
    },
  });

  const router = useRouter();
  const registerHacker = trpc.hacker.application.useMutation({
    onSuccess: async () => {
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

  return (
    <div className="mx-auto w-full max-w-screen-sm px-8 pb-8 pt-20">
      <h1 className="mb-4 text-center text-2xl font-bold">
        KnightHacks 2024 Application
      </h1>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (data) => {
            registerHacker.mutate(data);
          })}
        >
          <h2 className="text-xl font-semibold">Event Questions</h2>
          <FormField
            control={form.control}
            name="isFirstTime"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    This is my first time participating in a hackathon
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPlinktern"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I am interested in participating in Hack@UCF&apos;s Horse
                    Plinko event
                  </FormLabel>
                  <FormDescription>
                    You can learn more about Horse Plinko{" "}
                    <Link
                      className="font-bold underline underline-offset-4"
                      href="/#plinkno"
                    >
                      here
                    </Link>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <h2 className="text-xl font-semibold">Short Response Questions</h2>
          <FormField
            control={form.control}
            name="survey1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What motivates you to take part in this hackathon, and what do
                  you hope to achieve?
                </FormLabel>
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
            name="survey2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  If you choose to be any animal in the world, what would that
                  animal be and why?
                </FormLabel>
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
