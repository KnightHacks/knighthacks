import type { ColumnDef, Row } from "@tanstack/react-table";
import type { User as Hacker } from "lucide-react";
import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutput } from "@knighthacks/api";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { trpc } from "~/trpc";
import { UpdateHackerForm } from "./update-hacker-form";

type Hacker = RouterOutput["hackers"]["getAll"][number];

export const columns: ColumnDef<Hacker>[] = [
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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

function Actions({ row }: { row: Row<Hacker> }) {
  const hacker = row.original;

  const [updateHackerFormSheetOpen, setUpdateHackerFormSheetOpen] =
    useState(false);

  const utils = trpc.useUtils();
  const { mutate } = trpc.hackers.delete.useMutation({
    onSuccess: async () => {
      await utils.hackers.getAll.invalidate();
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
            <MoreHorizontal className="h-4 w-4" />
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
