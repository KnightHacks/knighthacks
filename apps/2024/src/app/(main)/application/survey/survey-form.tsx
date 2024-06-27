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
      agreesToReceiveEmailsFromMLH: false,
      hasReadAndAgreesToMLHCodeOfConduct: false,
      consentsToSharingApplicationWithMLHAndAgreesToTheMLHPrivacyPolicyAndContestTerms:
        false,
    },
  });

  const router = useRouter();
  const registerHacker = trpc.hacker.application.useMutation({
    onSuccess: () => {
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
          onSubmit={form.handleSubmit((data) => {
            registerHacker.mutate(data);
          })}
        >
          <h2 className="text-xl font-semibold">Event Questions</h2>
          <FormField
            control={form.control}
            name="isFirstTime"
            render={({ field }) => (
              <FormItem className="flex flex-row space-x-3 space-y-0">
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
              <FormItem className="flex flex-row space-x-3 space-y-0">
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
                      target="_blank"
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
          <FormField
            control={form.control}
            name="hasReadAndAgreesToMLHCodeOfConduct"
            render={({ field }) => (
              <FormItem className="flex flex-row space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I have read and agree to the{" "}
                    <a
                      className="font-bold underline underline-offset-4"
                      href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                    >
                      MLH Code of Conduct
                    </a>
                    .
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consentsToSharingApplicationWithMLHAndAgreesToTheMLHPrivacyPolicyAndContestTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="leading-5">
                    I authorize you to share my application/registration
                    information with Major League Hacking for event
                    administration, ranking, and MLH administration in-line with
                    the{" "}
                    <a
                      target="_blank"
                      className="font-bold underline underline-offset-4"
                      href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                    >
                      MLH Privacy Policy
                    </a>
                    . I further agree to the terms of both the{" "}
                    <a
                      target="_blank"
                      className="font-bold underline underline-offset-4"
                      href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                    >
                      MLH Contest Terms and Conditions
                    </a>{" "}
                    and the{" "}
                    <a
                      target="_blank"
                      className="font-bold underline underline-offset-4"
                      href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                    >
                      MLH Privacy Policy
                    </a>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agreesToReceiveEmailsFromMLH"
            render={({ field }) => (
              <FormItem className="flex flex-row space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="leading-5">
                    I authorize MLH to send me occasional emails about relevant
                    events, career opportunities, and community announcements.
                  </FormLabel>
                </div>
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
