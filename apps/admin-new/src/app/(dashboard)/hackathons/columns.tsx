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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@knighthacks/ui/dropdown-menu";
import { Sheet, SheetContent } from "@knighthacks/ui/sheet";
import { toast } from "@knighthacks/ui/toast";

import { trpc } from "~/trpc";

export const columns: ColumnDef<
  RouterOutput["hackathons"]["getAll"][number]
>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hackathon Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "theme",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Theme
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
  row: Row<RouterOutput["hackathons"]["getAll"][number]>;
}) {
  const hackathon = row.original;

  const [updateHackathonFormSheetOpen, setUpdateHackathonFormSheetOpen] =
    useState(false);

  const utils = trpc.useUtils();
  const { mutate } = trpc.hackathons.deleteHackathon.useMutation({
    onSuccess: async () => {
      await utils.hackathons.getAll.invalidate();
      toast("Success!", {
        description: "Hackathon deleted",
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
              await navigator.clipboard.writeText(hackathon.name);
              toast("Success!", {
                description: "Hackathon Name copied",
              });
            }}
          >
            Copy Hackathon name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              mutate(hackathon.name);
            }}
          >
            Delete Hackathon
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setUpdateHackathonFormSheetOpen(true)}
          >
            Update Hackathon
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet
        open={updateHackathonFormSheetOpen}
        onOpenChange={setUpdateHackathonFormSheetOpen}
      >
        <SheetContent>
          {/* <UpdateHackathonForm hackathon={hackathon} /> */}
        </SheetContent>
      </Sheet>
    </>
  );
}
