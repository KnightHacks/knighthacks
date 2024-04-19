"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import {
  GRADUATION_YEARS,
  MAJORS,
  SCHOOLS,
  SHIRT_SIZES,
} from "@knighthacks/consts";
import { CheckIcon, cn, DoubleArrowUpIcon } from "@knighthacks/ui";
import { Button } from "@knighthacks/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@knighthacks/ui/command";
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
import { ScrollArea } from "@knighthacks/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@knighthacks/ui/select";
import { toast } from "@knighthacks/ui/toast";
import { CreateUserProfileFormSchema } from "@knighthacks/validators";

import { trpc } from "~/trpc";

export function AddProfileForm({ userId }: { userId: string }) {
  const form = useForm({
    schema: CreateUserProfileFormSchema,
    defaultValues: {
      userId,
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
    },
  });
  const { getToken } = useAuth();
  const utils = trpc.useUtils();

  const addProfile = trpc.user.createProfile.useMutation({
    onSuccess: async () => {
      await utils.user.current.invalidate();
      toast("Success!", {
        description: "Created user profile",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  return (
    <>
      <h1 className="mb-2 text-lg font-semibold">Create Profile</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            const token = await getToken();

            let resumeKey = "";
            if (data.resume && token) {
              try {
                resumeKey = await uploadResume(data.resume, token);
                console.log(resumeKey);
              } catch {
                toast("Error!", {
                  description: "Failed to upload resume",
                });
              }
            }

            addProfile.mutate({
              ...data,
              resume: resumeKey,
            });
          })}
          className="mx-auto flex flex-1 flex-col justify-center space-y-6"
        >
          <FormField
            control={form.control}
            name="phone"
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shirt Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your shirt size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SHIRT_SIZES.map((size) => (
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
                          ? MAJORS.find((major) => major === field.value)
                          : "Select your major"}
                        <DoubleArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <MajorsComboBox value={field.value} form={form} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="school"
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
                          ? SCHOOLS.find((school) => school === field.value)
                          : "Select your school"}
                        <DoubleArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <SchoolsCombobox value={field.value} form={form} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gradYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Year</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your graduation year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GRADUATION_YEARS.map((gradYear) => (
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

          <Button type="submit">Create Knighthacks Profile</Button>
        </form>
      </Form>
    </>
  );
}

function MajorsComboBox({
  value,
  form,
}: {
  value: (typeof MAJORS)[number];
  form: ReturnType<typeof useForm<typeof CreateUserProfileFormSchema>>;
}) {
  const [search, setSearch] = useState("");
  const filteredMajors = useMemo(() => {
    return MAJORS.filter((major) =>
      major.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 5);
  }, [search]);

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search majors..."
      />
      <CommandEmpty>No major found.</CommandEmpty>
      <ScrollArea>
        <CommandGroup>
          {filteredMajors.map((major) => (
            <CommandItem
              value={major}
              key={major}
              onSelect={() => {
                form.setValue("major", major);
              }}
            >
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  major === value ? "opacity-100" : "opacity-0",
                )}
              />
              {major}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
}

function SchoolsCombobox({
  value,
  form,
}: {
  value: (typeof SCHOOLS)[number];
  form: ReturnType<typeof useForm<typeof CreateUserProfileFormSchema>>;
}) {
  const [search, setSearch] = useState("");
  const filteredSchools = useMemo(() => {
    return SCHOOLS.filter((school) =>
      school.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 5);
  }, [search]);

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search schools..."
      />
      <CommandEmpty>No school found.</CommandEmpty>
      <ScrollArea>
        <CommandGroup>
          {filteredSchools.map((school) => (
            <CommandItem
              value={school}
              key={school}
              onSelect={() => {
                form.setValue("school", school);
              }}
            >
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  school === value ? "opacity-100" : "opacity-0",
                )}
              />
              {school}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
}

export async function uploadResume(resume: File, token: string) {
  const formData = new FormData();
  formData.append("resume", resume);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/resume/upload/${resume.name}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { key } = (await res.json()) as { key: string };
  return key;
}
