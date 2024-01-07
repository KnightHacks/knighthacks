import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { RouterOutput } from "@knighthacks/api";
import { insertSponsorSchema } from "@knighthacks/db";

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

type Sponsor = RouterOutput["sponsors"]["getAll"][number];

const updateSponsorFormSchema = insertSponsorSchema;

type updateSponsorFormValues = z.infer<typeof updateSponsorFormSchema>

export function UpdateSponsorForm({sponsor }: {sponsor: Sponsor}) {
  const utils = trpc.useUtils();

  const form = useForm<updateSponsorFormValues>({
    resolver: zodResolver(updateSponsorFormSchema),
    defaultValues: {
      name: sponsor.name,
      website: sponsor.website,
      logo: sponsor.logo,
      tier: sponsor.tier,
      hackathonId: sponsor.hackathonId
    },
  });

  const { mutate, isLoading } = trpc.sponsors.update.useMutation({
    onSuccess: async () => {
      await utils.sponsors.getAll.invalidate();
      toast("Success!", {
        description: "User updated",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<updateSponsorFormValues> = (values) => {
    mutate({ id: sponsor.id, ...values })
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input placeholder="logo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier</FormLabel>
              <FormControl>
                <Input placeholder="tier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hackathonId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="number" placeholder="hackathonId" {...field} value={Number(field.value) || 1} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Update Sponsor
        </Button>
      </form>
    </Form>
  )
}