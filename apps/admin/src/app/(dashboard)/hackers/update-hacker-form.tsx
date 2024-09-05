import type { RouterOutput } from "@knighthacks/api";
import { APPLICATION_STATUSES } from "@knighthacks/consts";
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
import { Textarea } from "@knighthacks/ui/textarea";
import { toast } from "@knighthacks/ui/toast";
import { CreateHackerSchema } from "@knighthacks/validators";

import { api } from "~/trpc";

export function UpdateHackerForm({
  hacker,
}: {
  hacker: RouterOutput["hacker"]["adminAll"][number];
}) {
  const utils = api.useUtils();
  const updateHacker = api.hacker.adminUpdate.useMutation({
    onSuccess: async () => {
      await utils.hacker.adminAll.invalidate();
      toast("Success!", {
        description: "Hacker Status Updated.",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  const form = useForm({
    schema: CreateHackerSchema,
    defaultValues: {
      hackathonID: hacker.hackathonID,
      userID: hacker.userID,
      survey1: hacker.survey1,
      survey2: hacker.survey2,
      isFirstTime: hacker.isFirstTime as boolean | undefined,
      isPlinktern: hacker.isPlinktern as boolean | undefined,
      status: hacker.status,
      agreesToReceiveEmailsFromMLH: hacker.agreesToReceiveEmailsFromMLH as
        | boolean
        | undefined,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log("Form Data:", data);
          console.log("Form Errors:", form.formState.errors);
          updateHacker.mutate({
            hackerID: hacker.id,
            ...data,
          });
        })}
        className="flex flex-col justify-center space-y-6"
      >
        <FormField
          control={form.control}
          name="survey1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to attend Knight Hacks?</FormLabel>
              <FormControl>
                <Textarea
                  readOnly
                  placeholder="Why do you want to attend Knight Hacks?"
                  className="resize-none"
                  {...field}
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
              <FormLabel>What do you want to learn at Knight Hacks?</FormLabel>
              <FormControl>
                <Textarea
                  readOnly
                  placeholder="What do you want to learn at Knight Hacks?"
                  className="resize-none"
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
        <PlinkternSelect form={form} />
        <Button type="submit">Update Hacker</Button>
      </form>
    </Form>
  );
}

function HackathonSelect({
  form,
}: {
  form: ReturnType<typeof useForm<typeof CreateHackerSchema>>;
}) {
  const {
    data: hackathons,
    isPending,
    isError,
  } = api.hackathon.adminAll.useQuery();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading hackathons</div>;
  }

  return (
    <FormField
      control={form.control}
      name="hackathonID"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Hackathon</FormLabel>
          <Select
            defaultValue={field.value.toString()}
            onValueChange={(value) => {
              field.onChange(parseInt(value));
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a hackathon" />
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
  form: ReturnType<typeof useForm<typeof CreateHackerSchema>>;
}) {
  const { data: users, isPending, isError } = api.user.adminAll.useQuery();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading hackathons</div>;
  }

  return (
    <FormField
      control={form.control}
      name="userID"
      render={({ field }) => (
        <FormItem>
          <FormLabel>User</FormLabel>
          <Select
            defaultValue={field.value.toString()}
            onValueChange={(value) => field.onChange(parseInt(value))}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
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
  form: ReturnType<typeof useForm<typeof CreateHackerSchema>>;
}) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <Select defaultValue={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {APPLICATION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
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

function PlinkternSelect({
  form,
}: {
  form: ReturnType<typeof useForm<typeof CreateHackerSchema>>;
}) {
  return (
    <FormField
      control={form.control}
      name="isPlinktern"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Plinktern</FormLabel>
          <Select
            onValueChange={(value) => {
              // Convert the string value to a boolean
              const boolValue = value === "true";
              // Call the original onChange with the boolean value
              field.onChange(boolValue);
            }}
            value={field.value ? "true" : "false"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a boolean value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="true" value="true">
                True
              </SelectItem>
              <SelectItem key="false" value="false">
                False
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
