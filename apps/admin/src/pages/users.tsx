import type { ColumnDef, Row } from "@tanstack/react-table";
import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";

import type { RouterOutput } from "@knighthacks/api";
import { insertUserSchema } from "@knighthacks/db";

import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useToast } from "~/components/ui/use-toast";
import { trpc } from "~/trpc";

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
  const [updateUserDialogOpen, setUpdateUserDialogOpen] = useState(false);

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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              mutate(user.id);
            }}
          >
            Delete user
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUpdateUserDialogOpen(true)}>
            Update user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={updateUserDialogOpen}
        onOpenChange={setUpdateUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
          </DialogHeader>
          <UpdateUserForm user={user} />
        </DialogContent>
      </Dialog>
    </>
  );
}

const updateUserFormSchema = insertUserSchema.partial().omit({ id: true });

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
          Submit
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
          Submit
        </Button>
      </form>
    </Form>
  );
}
