import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { Redirect, useLocation } from "wouter";

import {
  gradYears,
  insertUserMetadataRequestSchema,
  majors,
  schools,
  shirtSizes,
} from "@knighthacks/db";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import { trpc } from "~/trpc";
import { cn } from "~/utils";

export function HackathonAccountRegistration() {
  const { data: currentUser, isLoading } = trpc.users.getCurrent.useQuery();

  if (isLoading) return <>Fetching current user...</>;

  if (currentUser?.metadata) return <Redirect to="/hackathon/registration" />;

  return <UserForm />;
}

type UserMetadataRequestSchema = z.infer<
  typeof insertUserMetadataRequestSchema
>;

function UserForm() {
  const form = useForm<UserMetadataRequestSchema>({
    resolver: zodResolver(insertUserMetadataRequestSchema),
    defaultValues: {
      phone: "",
      age: 18,
      shirtSize: "SM",
      major: "Computer Science",
      school: "The University of Central Florida",
      gradYear: "2025",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      github: "",
      personalWebsite: "",
      linkedin: "",
      resume: undefined,
    },
  });
  const { toast } = useToast();
  const [_, navigation] = useLocation();
  const { getToken } = useAuth();
  const utils = trpc.useUtils();
  const { error, isLoading, mutate } = trpc.users.insertMetadata.useMutation({
    onSuccess: async () => {
      // Since we have a new user, invalidate the current user query
      await utils.users.getCurrent.invalidate();
      toast({
        title: "Success!",
        description: "You've created a Knight Hacks account!",
      });
      navigation("/hackathon/registration");
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const onSubmit: SubmitHandler<UserMetadataRequestSchema> = async (data) => {
    let resume: string | null = null;
    if (data.resume) {
      // Upload resume
      const formData = new FormData();
      formData.append("resume", data.resume);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/resume/upload/${data.resume.name}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );

      if (!res.ok) {
        alert("Error uploading resume");
        return;
      }

      const { key } = (await res.json()) as { key: string };
      resume = key;
    }

    mutate({
      ...data,
      resume,
    });
  };

  if (error) alert(error.message);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mb-4 mt-4 flex w-2/3 flex-1 flex-col justify-center space-y-6"
      >
        <FormField
          control={form.control}
          name="phone"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shirtSize"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shirt Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your shirt size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {shirtSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="major"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Major</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? majors.find((major) => major === field.value)
                        : "Select your major"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search majors..." />
                    <CommandEmpty>No major found.</CommandEmpty>
                    <ScrollArea className="h-[400px]">
                      <CommandGroup>
                        {majors.map((major) => (
                          <CommandItem
                            value={major}
                            key={major}
                            onSelect={() => {
                              form.setValue("major", major);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                major === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {major}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="school"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>School</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? schools.find((school) => school === field.value)
                        : "Select your school"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search schools..." />
                    <CommandEmpty>No school found.</CommandEmpty>
                    <ScrollArea className="h-[400px]">
                      <CommandGroup>
                        {schools.map((school) => (
                          <CommandItem
                            value={school}
                            key={school}
                            onSelect={() => {
                              form.setValue("school", school);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                school === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {school}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gradYear"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Graduation Year</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your graduation year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gradYears.map((gradYear) => (
                    <SelectItem key={gradYear} value={gradYear}>
                      {gradYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address1"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="Address Line 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address2"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input
                  placeholder="Address Line 2"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zip"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="Zip Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="github"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub</FormLabel>
              <FormControl>
                <Input
                  placeholder="GitHub"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalWebsite"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="Personal Website"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedin"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input
                  placeholder="Personal Website"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resume"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
