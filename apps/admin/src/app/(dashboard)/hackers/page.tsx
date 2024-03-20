"use client";

import { useState } from "react";

import { Button } from "@knighthacks/ui/button";
import { Sheet, SheetContent } from "@knighthacks/ui/sheet";

import { DataTable } from "~/app/_components/data-table";
import { api } from "~/trpc";
import { CreateHackerForm } from "./create-hacker-form";
import { hackerColumns } from "./hacker-columns";

export default function Hackers() {
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
          <CreateHackerForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function HackathonsTable() {
  const { data: users, isLoading, error } = api.hacker.all.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={hackerColumns} data={users} />;
}
