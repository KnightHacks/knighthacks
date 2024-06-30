"use client";

import type { RouterOutput } from "@knighthacks/api";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  COUNTRIES,
  ETHNICITIES,
  GENDERS,
  MAJORS,
  SCHOOLS,
  SHIRT_SIZES,
  US_STATES,
} from "@knighthacks/consts";
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
import {
  set,
  UpdateProfileApplicationFormSchema,
} from "@knighthacks/validators";

import { env } from "~/env";
import { trpc } from "~/trpc/client";

export function UpdateProfileForm({
  user,
}: {
  user: NonNullable<RouterOutput["user"]["getUser"]>;
}) {
  const [newResume, setNewResume] = useState<string | null>(null);
  const form = useForm({
    schema: UpdateProfileApplicationFormSchema,
    defaultValues: {
      userID: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address1: user.profile.address1,
      address2: user.profile.address2 ?? "",
      age: String(user.profile.age),
      city: user.profile.city,
      country: user.profile.country,
      discord: user.profile.discord,
      email: user.email,
      ethnicity: user.profile.ethnicity,
      gender: user.profile.gender,
      github: user.profile.github ?? "",
      gradYear: user.profile.gradYear,
      linkedin: user.profile.linkedin ?? "",
      major: user.profile.major,
      personalWebsite: user.profile.personalWebsite ?? "",
      phone: user.profile.phone,
      school: user.profile.school,
      shirtSize: user.profile.shirtSize,
      state: user.profile.state,
      zip: user.profile.zip,
    },
  });

  const { getToken } = useAuth();

  const createProfile = trpc.user.updateProfileApplication.useMutation({
    onSuccess: (_, { resume }) => {
      toast("Success!", {
        description: "Updated user profile",
      });
      if (resume) {
        setNewResume(resume);
      }
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  return (
    <div className="mx-auto w-full max-w-screen-sm px-8 pb-8">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Update Your Profile!
      </h1>
      <Form {...form}>
        <form
          noValidate
          className="min-w-0 space-y-4"
          onSubmit={form.handleSubmit(async (data) => {
            const token = await getToken();

            let resumeKey = "";
            if (data.resume && token) {
              try {
                resumeKey = await uploadResume(
                  data.resume as unknown as File,
                  token,
                );
              } catch {
                toast("Error!", {
                  description: "Failed to upload resume",
                });
              }
            }

            createProfile.mutate({
              ...data,
              resume: resumeKey,
              age: Number(data.age),
            });
          })}
        >
          <h2 className="text-xl font-semibold">About You</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="sm:max-w-[54px]">
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Age"
                      min={18}
                      max={100}
                      className="[appearance:textfield]  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      {...field}
                      onChange={(e) => field.onChange(String(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shirtSize"
              render={({ field }) => (
                <FormItem className="sm:w-[80px]">
                  <FormLabel>Shirt Size</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discord"
              render={({ field }) => (
                <FormItem className="sm:max-w-[150px]">
                  <FormLabel>Discord</FormLabel>
                  <FormControl>
                    <Input placeholder="Discord" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="sm:max-w-[114px]">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="ethnicity"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Ethnicity</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your ethnicity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ETHNICITIES.map((ethnicity) => (
                        <SelectItem key={ethnicity} value={ethnicity}>
                          {ethnicity}
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
              name="gender"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Gender</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>School</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "flex w-full justify-between truncate px-3 ",
                          )}
                        >
                          <span className="truncate">
                            {SCHOOLS.find((school) => school === field.value)}
                          </span>
                          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <SchoolsCombobox
                        value={field.value ?? user.profile.school}
                        form={form}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Major</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("flex w-full justify-between px-3 ")}
                        >
                          <span className="truncate">
                            {MAJORS.find((major) => major === field.value)}
                          </span>
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
              name="gradYear"
              render={({ field }) => (
                <FormItem className="sm:max-w-[90px]">
                  <FormLabel>Grad Year</FormLabel>
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
          </div>

          <h2 className="text-xl font-semibold">Shipping Information</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Country</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("flex w-full justify-between px-3")}
                        >
                          {COUNTRIES.find((country) => country === field.value)}
                          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <CountriesCombobox value={field.value} form={form} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("country") === "United States" ? (
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "flex w-full justify-between px-3",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? US_STATES.find((state) => state === field.value)
                              : "Select the state you reside in"}
                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <USStatesCombobox
                          value={field.value as (typeof US_STATES)[number]}
                          form={form}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State or Province</FormLabel>
                    <FormControl>
                      <Input placeholder="State or province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="sm:max-w-[125px]">
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
              name="zip"
              render={({ field }) => (
                <FormItem className="sm:max-w-[86px]">
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem className="flex-1">
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
                <FormItem className="flex-1">
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
          </div>

          <h2 className="text-xl font-semibold">For Our Sponsors</h2>
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
                    placeholder="LinkedIn"
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
                {(user.profile.resume || newResume) && (
                  <Button
                    variant="link"
                    type="button"
                    className="h-fit text-wrap p-0"
                    onClick={async () => {
                      const token = await getToken();

                      const resume = await fetch(
                        `${env.NEXT_PUBLIC_API_URL}/resume/download/${newResume ?? user.profile.resume}`,
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
                    {newResume || user.profile.resume}
                  </Button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Update User Profile
          </Button>
        </form>
      </Form>
    </div>
  );
}

function MajorsComboBox({
  value,
  form,
}: {
  value?: (typeof MAJORS)[number];
  form: ReturnType<typeof useForm<typeof UpdateProfileApplicationFormSchema>>;
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
        placeholder="Search for more majors..."
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
  form: ReturnType<typeof useForm<typeof UpdateProfileApplicationFormSchema>>;
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
        placeholder="Search for more schools..."
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

function CountriesCombobox({
  value,
  form,
}: {
  value?: (typeof COUNTRIES)[number];
  form: ReturnType<typeof useForm<typeof UpdateProfileApplicationFormSchema>>;
}) {
  const [search, setSearch] = useState("");
  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((country) =>
      country.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 5);
  }, [search]);

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search for more countries..."
      />
      <CommandEmpty>No country found.</CommandEmpty>
      <ScrollArea>
        <CommandGroup>
          {filteredCountries.map((country) => (
            <CommandItem
              value={country}
              key={country}
              onSelect={() => {
                if (country !== "United States") form.setValue("state", "");
                else form.setValue("state", "Florida");
                form.setValue("country", country);
              }}
            >
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  country === value ? "opacity-100" : "opacity-0",
                )}
              />
              {country}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
}

function USStatesCombobox({
  value,
  form,
}: {
  value?: (typeof US_STATES)[number];
  form: ReturnType<typeof useForm<typeof UpdateProfileApplicationFormSchema>>;
}) {
  const [search, setSearch] = useState("");
  const filteredStates = useMemo(() => {
    return US_STATES.filter((state) =>
      state.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 5);
  }, [search]);

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search for more states..."
      />
      <CommandEmpty>No state found.</CommandEmpty>
      <ScrollArea>
        <CommandGroup>
          {filteredStates.map((state) => (
            <CommandItem
              value={state}
              key={state}
              onSelect={() => {
                form.setValue("state", state);
              }}
            >
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  state === value ? "opacity-100" : "opacity-0",
                )}
              />
              {state}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
}

async function uploadResume(resume: File, token: string) {
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
