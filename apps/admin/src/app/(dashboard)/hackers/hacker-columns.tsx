import type { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";

import type { RouterOutput } from "@knighthacks/api";
import { CaretSortIcon, DotsHorizontalIcon } from "@knighthacks/ui";
import { Button } from "@knighthacks/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@knighthacks/ui/dropdown-menu";
import { Sheet, SheetContent } from "@knighthacks/ui/sheet";
import { toast } from "@knighthacks/ui/toast";

import { api } from "~/trpc";
import { UpdateHackerForm } from "./update-hacker-form";

export const hackerColumns: ColumnDef<
  RouterOutput["hacker"]["adminAll"][number]
>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user",
    accessorFn: (hacker) => `${hacker.user.firstName} ${hacker.user.lastName}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hacker
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "hackathon",
    accessorFn: (hacker) => hacker.hackathon?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hackathon
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "whyAttend",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Why are they attending?
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "whatLearn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          What do they want to learn?
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
  row: Row<RouterOutput["hacker"]["adminAll"][number]>;
}) {
  const hacker = row.original;

  const [updateHackerFormSheetOpen, setUpdateHackerFormSheetOpen] =
    useState(false);

  const utils = api.useUtils();
  const { mutate } = api.hacker.adminDelete.useMutation({
    onSuccess: async () => {
      await utils.hacker.adminAll.invalidate();
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
            onClick={() => {
              mutate(hacker.id);
            }}
          >
            Delete hacker
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUpdateHackerFormSheetOpen(true)}>
            Update hacker
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet
        open={updateHackerFormSheetOpen}
        onOpenChange={setUpdateHackerFormSheetOpen}
      >
        <SheetContent>
          <UpdateHackerForm hacker={hacker} />
        </SheetContent>
      </Sheet>
    </>
  );
}
