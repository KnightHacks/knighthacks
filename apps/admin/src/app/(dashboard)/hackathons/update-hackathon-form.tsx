import type { RouterOutput } from "@knighthacks/api";
import { CalendarIcon, cn } from "@knighthacks/ui";
import { Button } from "@knighthacks/ui/button";
import { Calendar } from "@knighthacks/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@knighthacks/ui/popover";
import { toast } from "@knighthacks/ui/toast";
import { UpdateHackathonFormSchema } from "@knighthacks/validators";
import { format } from "date-fns";

import { api } from "~/trpc";

export function UpdateHackathonForm({
  hackathon,
}: {
  hackathon: NonNullable<RouterOutput["hackathon"]["adminAll"][number]>;
}) {
  const utils = api.useUtils();
  const updateHackathon = api.hackathon.adminUpdate.useMutation({
    onSuccess: async () => {
      await utils.hackathon.adminAll.invalidate();
      toast("Success!", {
        description: "Updated hackathon",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  const form = useForm({
    schema: UpdateHackathonFormSchema,
    defaultValues: {
      hackathonID: hackathon.id,
      name: hackathon.name,
      date: {
        from: new Date(hackathon.startDate),
        to: new Date(hackathon.endDate),
      },
      theme: hackathon.theme ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          updateHackathon.mutate({
            hackathonID: data.hackathonID,
            name: data.name,
            theme: data.theme,
            startDate: data.date?.from?.toISOString().split("T")[0] ?? "",
            endDate: data.date?.to?.toISOString().split("T")[0] ?? "",
          });
        })}
        className="flex flex-col justify-center space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hackathon Name</FormLabel>
              <FormControl>
                <Input placeholder="Hackathon Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field?.value?.from ? (
                        field?.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={{
                        from: field.value?.from,
                        to: field.value?.to,
                      }}
                      onSelect={field.onChange}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <Input placeholder="Theme" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Hackathon</Button>
      </form>
    </Form>
  );
}
