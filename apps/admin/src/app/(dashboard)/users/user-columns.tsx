import type { RouterOutput } from "@knighthacks/api";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { CaretSortIcon, DotsHorizontalIcon } from "@knighthacks/ui";
import { Button } from "@knighthacks/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@knighthacks/ui/dropdown-menu";
import { Sheet, SheetContent } from "@knighthacks/ui/sheet";
import { toast } from "@knighthacks/ui/toast";

import { api } from "~/trpc";
import { CreateUserProfileForm } from "./create-user-profile-form";
import { UpdateUserForm } from "./update-user-form";
import { UpdateProfileForm } from "./update-user-profile-form";

export const userColumns: ColumnDef<
  RouterOutput["user"]["adminAll"][number]
>[] = [
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
          <CaretSortIcon className="ml-2 h-4 w-4" />
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
          <CaretSortIcon className="ml-2 h-4 w-4" />
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
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: Actions,
  },
];

function Actions({
  row,
}: {
  row: Row<RouterOutput["user"]["adminAll"][number]>;
}) {
  const user = row.original;

  const [updateUserFormSheetOpen, setUpdateUserFormSheetOpen] = useState(false);
  const [userProfileFormSheetOpen, setUserProfileFormSheetOpen] =
    useState(false);

  const utils = api.useUtils();
  const deleteUser = api.user.adminDelete.useMutation({
    onSuccess: async () => {
      await utils.user.adminAll.invalidate();
      toast("Success!", {
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
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={async () => {
              await navigator.clipboard.writeText(user.id.toString());
              toast("Success!", {
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
              deleteUser.mutate(user.id);
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
          {user.profile ? (
            <UpdateProfileForm userProfile={user.profile} />
          ) : (
            <CreateUserProfileForm userID={user.id} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
