"use client";

import { useState } from "react";

import { Button } from "@knighthacks/ui/button";
import { Sheet, SheetContent } from "@knighthacks/ui/sheet";

import { api } from "~/trpc";
import { DataTable } from "../_components/data-table";
import { CreateSponsorForm } from "./create-sponsor-form";
import { sponsorColumns } from "./sponsor-columns";

export const runtime = "edge";

export default function Sponsors() {
  const [addSponsorFormSheetOpen, setAddSponsorFormSheetOpen] = useState(false);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Button onClick={() => setAddSponsorFormSheetOpen(true)}>
            Create Sponsor
          </Button>
        </div>
        <SponsorTable />
        <Sheet
          open={addSponsorFormSheetOpen}
          onOpenChange={setAddSponsorFormSheetOpen}
        >
          <SheetContent>
            <CreateSponsorForm />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function SponsorTable() {
  const { data: sponsors, isPending, error } = api.sponsor.userAll.useQuery();

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={sponsorColumns} data={sponsors} />;
}
