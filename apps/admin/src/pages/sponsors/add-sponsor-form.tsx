import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

  const InsertSponsorFormSchema = insertSponsorSchema;
  type InsertSponsorFormValues = z.infer<typeof InsertSponsorFormSchema>;

  export function AddSponsorForm() {

    const utils = trpc.useUtils();
    const { mutate, isLoading } = trpc.sponsors.add.useMutation({
        onSuccess: async () => {
          await utils.sponsors.invalidate()
          toast("Success!", {
            description: "Sponsor added",
          });
        },
    });

    const form = useForm<InsertSponsorFormValues>({
      resolver: zodResolver(InsertSponsorFormSchema),
      defaultValues: {
        name: "",
        logo: "",
        website: "",
        hackathonId: 1,
      },
    });

    const onSubmit: SubmitHandler<InsertSponsorFormValues> = (values) => {
      mutate(values)
    }

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
                        <FormControl>
                          <Input placeholder="Tier" {...field} />
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
                        <FormLabel>HackathonId</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="HackathonId" {...field} value={field.value || 0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                 Add Sponsor
                </Button>
            </form>
        </Form>
    )
  }
