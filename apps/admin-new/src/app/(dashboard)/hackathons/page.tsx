"use client";

import { useState } from "react";

import { Button } from "@knighthacks/ui/button";
import { Sheet, SheetContent } from "@knighthacks/ui/sheet";

import { DataTable } from "~/app/_components/data-table";
import { api } from "~/trpc";
import { CreateHackathonForm } from "./create-hackathon-form";
import { hackathonColumns } from "./hackathon-columns";

export default function Hackathons() {
  const [createHackathonFormSheetOpen, setCreateHackathonFormSheetOpen] =
    useState(false);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Button onClick={() => setCreateHackathonFormSheetOpen(true)}>
            Create Hackathon
          </Button>
        </div>
        <HackathonsTable />
      </div>
      <Sheet
        open={createHackathonFormSheetOpen}
        onOpenChange={setCreateHackathonFormSheetOpen}
      >
        <SheetContent>
          <CreateHackathonForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function HackathonsTable() {
  const { data: users, isLoading, error } = api.hackathon.all.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={hackathonColumns} data={users} />;
}
