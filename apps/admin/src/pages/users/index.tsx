import type { ColumnDef, Row } from "@tanstack/react-table";
import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpDown,
  Check,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";

import type { RouterOutput } from "@knighthacks/api";
import {
  gradYears,
  insertUserProfileFormSchema,
  insertUserSchema,
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
import { DataTable } from "~/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { useToast } from "~/components/ui/use-toast";
import { trpc } from "~/trpc";
import { cn } from "~/utils";

export function Users() {
  return (
    <div className="px-4">
      <Dialog>
        <div className="mx-auto max-w-5xl">
          <div className="mb-4">
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>
          </div>
          <UserTable />
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <AddUserForm />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function UserTable() {
  const { data: users, isLoading, error } = trpc.users.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={columns} data={users} />;
}

type User = RouterOutput["users"]["getAll"][number];

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: Actions,
  },
];

function Actions({ row }: { row: Row<User> }) {
  const [updateUserFormSheetOpen, setUpdateUserFormSheetOpen] = useState(false);
  const [addUserProfileFormSheetOpen, setAddUserProfileFormSheetOpen] =
    useState(false);

  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { mutate } = trpc.users.delete.useMutation({
    onSuccess: async () => {
      await utils.users.getAll.invalidate();
      toast({
        title: "Success!",
        description: "User deleted",
      });
    },
  });
  const user = row.original;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={async () => {
              await navigator.clipboard.writeText(user.id);
              toast({
                title: "Success!",
                description: "User ID copied",
              });
            }}
          >
            Copy user ID
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/users/${user.id}`}>View user</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              mutate(user.id);
            }}
          >
            Delete user
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUpdateUserFormSheetOpen(true)}>
            Update user
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setAddUserProfileFormSheetOpen(true)}
          >
            Add user profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet
        open={updateUserFormSheetOpen}
        onOpenChange={setUpdateUserFormSheetOpen}
      >
        <SheetContent>
          <UpdateUserForm user={user} />
        </SheetContent>
      </Sheet>
      <Sheet
        open={addUserProfileFormSheetOpen}
        onOpenChange={setAddUserProfileFormSheetOpen}
      >
        <SheetContent>
          <AddUserProfileForm />
        </SheetContent>
      </Sheet>
    </>
  );
}

const updateUserFormSchema = insertUserSchema.omit({ id: true });

type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;

function UpdateUserForm({ user }: { user: User }) {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  const { mutate, isLoading } = trpc.users.update.useMutation({
    onSuccess: async () => {
      await utils.users.getAll.invalidate();
      toast({
        title: "Success!",
        description: "User updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<UpdateUserFormValues> = (values) => {
    mutate({
      id: user.id,
      ...values,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center space-y-6"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Update User
        </Button>
      </form>
    </Form>
  );
}

const insertUserFormSchema = insertUserSchema.omit({ id: true });

type InsertUserFormValues = z.infer<typeof insertUserFormSchema>;

function AddUserForm() {
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const { mutate, isLoading } = trpc.users.add.useMutation({
    onSuccess: async () => {
      await utils.users.getAll.invalidate();
      toast({
        title: "Success!",
        description: "User added",
      });
    },
  });
  const form = useForm<InsertUserFormValues>({
    resolver: zodResolver(insertUserFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit: SubmitHandler<InsertUserFormValues> = (values) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center space-y-6"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Add User
        </Button>
      </form>
    </Form>
  );
}

type UserProfileFormValues = z.infer<typeof insertUserProfileFormSchema>;

function AddUserProfileForm() {
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(insertUserProfileFormSchema),
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
    },
  });
  const { toast } = useToast();
  const [_, navigation] = useLocation();
  const { getToken } = useAuth();
  const utils = trpc.useUtils();
  const { error, isLoading, mutate } = trpc.users.addProfile.useMutation({
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

  const onSubmit: SubmitHandler<UserProfileFormValues> = async (data) => {
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
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
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
      <ScrollArea className="h-96">
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
