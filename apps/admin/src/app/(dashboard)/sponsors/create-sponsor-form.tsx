import { SPONSOR_TIERS } from "@knighthacks/consts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@knighthacks/ui/select";
import { toast } from "@knighthacks/ui/toast";
import { CreateSponsorSchema } from "@knighthacks/validators";

import { api } from "~/trpc";

export function CreateSponsorForm() {
  const utils = api.useUtils();

  const createSponsor = api.sponsor.adminCreate.useMutation({
    onSuccess: async () => {
      await utils.sponsor.userAll.invalidate();
      toast("Success!", {
        description: "Sponsor added",
      });
    },
  });

  const form = useForm({
    schema: CreateSponsorSchema,
    defaultValues: {
      name: "",
      logo: "",
      website: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          createSponsor.mutate(data);
        })}
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
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input placeholder="Logo" {...field} />
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
                <Input placeholder="Website" {...field} />
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
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SPONSOR_TIERS.map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <HackathonSelect form={form} />
        <Button type="submit">Add Sponsor</Button>
      </form>
    </Form>
  );
}

function HackathonSelect({
  form,
}: {
  form: ReturnType<typeof useForm<typeof CreateSponsorSchema>>;
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
