import type { SubmitHandler } from "react-hook-form";
import {useState, useEffect} from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

  const InsertSponsorFormSchema = insertSponsorSchema;
  type InsertSponsorFormValues = z.infer<typeof InsertSponsorFormSchema>;

  export function AddSponsorForm() {
    const [hackathonIds, setHackathonIds] = useState<number[]>([]);

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

    // Fill with valid hackathonId's
    // Use hook directly within the component body or useEffect
    const { data: hackathons } = trpc.hackathons.getAll.useQuery();

    // useEffect to call getHackathonIds on component mount
    useEffect(() => {
      if (hackathons) {
        const fetchedHackathonIds = hackathons.map((hackathon) => hackathon.id) || [];
        setHackathonIds(fetchedHackathonIds);
      }
    }, [hackathons]);

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
                          <Select onValueChange={(selectedValue) => {
                            // Convert the selected value to a number
                            const numericValue = parseInt(selectedValue, 10);
                            // Now you can use `numericValue` as a number
                            field.onChange(numericValue);
                          }} >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Hackathon Id" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hackathonIds.map((id) => (
                                <SelectItem key={id} value={String(id)}>
                                  {id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
