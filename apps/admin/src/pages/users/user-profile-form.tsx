import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { RouterInput } from "@knighthacks/api";
import {
  gradYears,
  insertUserProfileFormSchema,
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
import { trpc } from "~/trpc";
import { cn, uploadResume } from "~/utils";

type UserProfileFormValues = z.infer<typeof insertUserProfileFormSchema>;

export function UserProfileForm({
  user,
}: {
  user: RouterInput["users"]["updateProfile"] | null;
}) {
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(insertUserProfileFormSchema),
    defaultValues: {
      phone: user?.phone ?? "",
      age: user?.age ?? 18,
      shirtSize: user?.shirtSize ?? "SM",
      major: user?.major ?? "Computer Science",
      school: user?.school ?? "The University of Central Florida",
      gradYear: user?.gradYear ?? "2025",
      address1: user?.address1 ?? "",
      address2: user?.address2 ?? "",
      city: user?.city ?? "",
      state: user?.state ?? "",
      zip: user?.zip ?? "",
      country: user?.country ?? "",
      github: user?.github ?? "",
      personalWebsite: user?.personalWebsite ?? "",
      linkedin: user?.linkedin ?? "",
    },
  });
  const { getToken } = useAuth();
  const utils = trpc.useUtils();

  const { isLoading: isAddingUser, mutate: addProfile } =
    trpc.users.addProfile.useMutation({
      onSuccess: async () => {
        await utils.users.getCurrent.invalidate();
        toast("Success!", {
          description: "You've created a Knight Hacks account!",
        });
      },
    });

  const { isLoading: isUpdatingUser, mutate: updateProfile } =
    trpc.users.updateProfile.useMutation({
      onSuccess: async () => {
        await utils.users.getCurrent.invalidate();
        await utils.users.all.invalidate();
        toast("Success!", {
          description: "You've updated your profile!",
        });
      },
    });

  const onSubmit: SubmitHandler<UserProfileFormValues> = async (data) => {
    const token = await getToken();

    let resume: string | null = null;
    if (data.resume && token) {
      try {
        resume = await uploadResume(data.resume, token);
        console.log(resume);
      } catch {
        toast("Error!", {
          description: "Failed to upload resume",
        });
      }
    }

    if (user) {
      updateProfile({
        ...data,
        resume: resume ?? user.resume,
      });
      return;
    }

    addProfile({
      ...data,
      resume,
    });
  };

  return (
    <>
      <h1 className="mb-2 text-lg font-semibold">
        {user ? "Update Profile" : "Create Profile"}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
                          ? schools.find((school) => school === field.value)
                          : "Select your school"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                {user?.resume && (
                  <button
                    className="text-left text-sm text-blue-500 underline"
                    type="button"
                    onClick={async () => {
                      const token = await getToken();

                      const resume = await fetch(
                        `${
                          import.meta.env.VITE_API_URL
                        }/resume/download/${user?.resume}`,
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
                    {user?.resume}
                  </button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isAddingUser || isUpdatingUser}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}

interface MajorsComboboxProps {
  value: (typeof majors)[number];
  form: ReturnType<typeof useForm<UserProfileFormValues>>;
}

function MajorsComboBox({ value, form }: MajorsComboboxProps) {
  const [search, setSearch] = useState("");
  const filteredMajors = useMemo(() => {
    return majors
      .filter((major) => major.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 10);
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
              <Check
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

interface SchoolsComboboxProps {
  value: (typeof schools)[number];
  form: ReturnType<typeof useForm<UserProfileFormValues>>;
}

function SchoolsCombobox({ value, form }: SchoolsComboboxProps) {
  const [search, setSearch] = useState("");
  const filteredSchools = useMemo(() => {
    return schools
      .filter((school) => school.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 10);
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
              <Check
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
