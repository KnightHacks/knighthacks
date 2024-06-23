import type { RouterOutput } from "@knighthacks/api";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { MAJORS, SCHOOLS, SHIRT_SIZES } from "@knighthacks/consts";
import { CheckIcon, ChevronDownIcon, cn } from "@knighthacks/ui";
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
import { UpdateUserProfileFormSchema } from "@knighthacks/validators";

import { env } from "~/env";
import { api } from "~/trpc";

export function UpdateProfileForm({
  userProfile,
}: {
  userProfile: NonNullable<RouterOutput["user"]["adminAll"][number]["profile"]>;
}) {
  const form = useForm({
    schema: UpdateUserProfileFormSchema,
    defaultValues: {
      userID: userProfile.userID,
      phone: userProfile.phone,
      age: userProfile.age,
      shirtSize: userProfile.shirtSize,
      major: userProfile.major,
      school: userProfile.school,
      gradYear: userProfile.gradYear,
      address1: userProfile.address1,
      address2: userProfile.address2 ?? "",
      city: userProfile.city,
      state: userProfile.state,
      zip: userProfile.zip,
      country: userProfile.country,
      github: userProfile.github ?? "",
      personalWebsite: userProfile.personalWebsite ?? "",
      linkedin: userProfile.linkedin ?? "",
    },
  });
  const { getToken } = useAuth();
  const utils = api.useUtils();

  const updateProfile = api.user.adminUpdateProfile.useMutation({
    onSuccess: async () => {
      await utils.user.adminAll.invalidate();
      toast("Success!", {
        description: "Updated user profile",
      });
    },
  });

  return (
    <>
      <h1 className="mb-2 text-lg font-semibold">Update Profile</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            const token = await getToken();

            let resumeKey = "";
            console.log(data.resume, token);
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

            updateProfile.mutate({
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
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    {Array.from(
                      { length: 5 },
                      (_, i) => new Date().getFullYear() + i,
                    ).map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
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
                    value={field.value}
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
                  <Input placeholder="GitHub" {...field} value={field.value} />
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
                    value={field.value}
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
                    value={field.value}
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
                {userProfile.resume && (
                  <Button
                    variant="link"
                    type="button"
                    className="h-fit text-wrap p-0"
                    onClick={async () => {
                      const token = await getToken();

                      const resume = await fetch(
                        `${env.NEXT_PUBLIC_API_URL}/resume/download/${userProfile.resume}`,
                        {
                          method: "GET",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );

                      const blob = await resume.blob();
                      const url = URL.createObjectURL(blob);
                      window.open(url);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    {userProfile.resume}
                  </Button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Update User Profile</Button>
        </form>
      </Form>
    </>
  );
}

function MajorsComboBox({
  value,
  form,
}: {
  value?: (typeof MAJORS)[number];
  form: ReturnType<typeof useForm<typeof UpdateUserProfileFormSchema>>;
}) {
  const [search, setSearch] = useState("");
  const filteredMajors = useMemo(() => {
    return MAJORS.filter((major) =>
      major.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 10);
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
  value?: (typeof SCHOOLS)[number];
  form: ReturnType<typeof useForm<typeof UpdateUserProfileFormSchema>>;
}) {
  const [search, setSearch] = useState("");
  const filteredSchools = useMemo(() => {
    return SCHOOLS.filter((school) =>
      school.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 10);
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
    `${env.NEXT_PUBLIC_API_URL}/resume/upload/${resume.name}`,
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
