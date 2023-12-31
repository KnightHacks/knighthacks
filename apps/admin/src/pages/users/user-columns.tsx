import type { ColumnDef, Row } from "@tanstack/react-table";
import type { User } from "lucide-react";
import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import type { RouterOutput } from "@knighthacks/api";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { useToast } from "~/components/ui/use-toast";
import { trpc } from "~/trpc";
import { UpdateUserForm } from "./update-user-form";
import { UserProfileForm } from "./user-profile-form";

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
  const user = row.original;

  const [updateUserFormSheetOpen, setUpdateUserFormSheetOpen] = useState(false);
  const [userProfileFormSheetOpen, setUserProfileFormSheetOpen] =
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
          <DropdownMenuItem
            onClick={() => {
              setUserProfileFormSheetOpen(true);
            }}
          >
            View profile
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
        open={userProfileFormSheetOpen}
        onOpenChange={setUserProfileFormSheetOpen}
      >
        <SheetContent>
          <UserProfileForm user={user.profile} />
        </SheetContent>
      </Sheet>
    </>
  );
}
