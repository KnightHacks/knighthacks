"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@knighthacks/ui/select";
import { toast } from "@knighthacks/ui/toast";
import { UpdateHackerSchema } from "@knighthacks/validators";

import { trpc } from "~/trpc/client";

type HackerWithoutUserAndHackathon = Omit<
  RouterOutput["hacker"]["adminAll"][number],
  "user" | "hackathon"
>;

export function ConfirmStatusForm({
  hacker,
}: {
  hacker: HackerWithoutUserAndHackathon;
}) {
  const form = useForm({
    schema: UpdateHackerSchema,
    defaultValues: {
      hackerID: hacker.id,
      userID: hacker.userID,
      status: hacker.status,
      survey1: hacker.survey1,
      survey2: hacker.survey2,
      agreesToReceiveEmailsFromMLH: hacker.agreesToReceiveEmailsFromMLH
        ? hacker.agreesToReceiveEmailsFromMLH
        : undefined,
      isFirstTime: hacker.isFirstTime ? hacker.isFirstTime : undefined,
    },
  });

  const updateHacker = trpc.hacker.adminUpdate.useMutation({
    onSuccess: () => {
      toast("Success!", {
        description: "Updated your status!",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  return (
    <div className="mb-8s mx-auto mb-[220px] mt-[150px] w-full max-w-screen-sm rounded-xl bg-white p-8 pb-8">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Confirm your status!
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            updateHacker.mutate({
              status: data.status,
              ...data,
            });
          })}
          className="flex flex-col justify-center space-y-6"
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Will you be able to attend Knighthacks?</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value === "withdrawn") {
                      alert(
                        "Warning: Once you withdraw from the hackathon you will not be able to re-enter",
                      );
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem key="Yes" value="confirmed">
                      Yes
                    </SelectItem>
                    <SelectItem key="No" value="withdrawn">
                      No
                    </SelectItem>
                  </SelectContent>
                  <FormMessage />
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">Update Status</Button>
        </form>
      </Form>
    </div>
  );
}
