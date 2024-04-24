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

import { api } from "~/trpc";
import { UpdateSponsorForm } from "./update-sponsor-form";

export const sponsorColumns: ColumnDef<
  RouterOutput["sponsor"]["adminAll"][number]
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
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "logo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Logo
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.original.logo}
          alt="Logo"
          className="h-[55px] w-[55px] rounded-full"
          loading="lazy"
          decoding="async"
        />
      );
    },
  },
  {
    accessorKey: "website",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Website
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "tier",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Tier
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center">{row.original.tier}</p>;
    },
  },
  {
    accessorKey: "hackathonId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Hackathon Id
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center">{row.original.hackathonId}</p>;
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
  row: Row<RouterOutput["sponsor"]["adminAll"][number]>;
}) {
  const sponsor = row.original;
  const utils = api.useUtils();

  const [updateSponsorFormSheetOpen, setUpdateSponsorFormSheetOpen] =
    useState(false);

  const { mutate } = api.sponsor.adminDelete.useMutation({
    onSuccess: async () => {
      await utils.sponsor.adminAll.invalidate();
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
            //On click copy number to clipboard
            onClick={async () => {
              await navigator.clipboard.writeText(String(sponsor.id));
              toast("Success!", {
                description: "User ID copied",
              });
            }}
          >
            Copy Sponsor ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              mutate(sponsor.id);
            }}
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
  );
}
