import type { ColumnDef, Row } from "@tanstack/react-table";
import type { User } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { trpc } from "~/trpc";
import { UpdateSponsorForm } from "./update-sponsor-form";

type sponsor = RouterOutput['sponsors']['getAll'][number];

export const columns: ColumnDef<sponsor>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        }
    },
    {
        accessorKey: 'website',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Website
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        }
    },
    {
        accessorKey: 'tier',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Tier
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        }
    },
    {
        accessorKey: 'hackathonId',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Hackathon Id
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        }
    },
    {
        id: 'actions',
        cell: Actions
    },
];

function Actions({row }: { row: Row<sponsor> }) {
    const sponsor = row.original;

    const [updateSponsorFormSheetOpen, setUpdateSponsorFormSheetOpen] = useState(false);

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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              // On Click delete sponsor
            >
              Delete Sponsor
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUpdateSponsorFormSheetOpen(true)}>
              Update Sponsor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet
        open={updateSponsorFormSheetOpen}
        onOpenChange={setUpdateSponsorFormSheetOpen}
        >
        <SheetContent>
          <UpdateSponsorForm sponsor={sponsor} />
        </SheetContent>
      </Sheet>
      </>        
    )
}