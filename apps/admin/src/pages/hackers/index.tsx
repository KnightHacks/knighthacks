import { useState } from "react";

import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { trpc } from "~/trpc";
import { AddHackerForm } from "./add-hacker-form";
import { columns } from "./hacker-columns";

export function Hackers() {
  const [addUserFormSheetOpen, setAddUserFormSheetOpen] = useState(false);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Button onClick={() => setAddUserFormSheetOpen(true)}>
            Add Hacker
          </Button>
        </div>
        <HackersTable />
      </div>
      <Sheet open={addUserFormSheetOpen} onOpenChange={setAddUserFormSheetOpen}>
        <SheetContent>
          <AddHackerForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function HackersTable() {
  const { data: users, isLoading, error } = trpc.hackers.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={columns} data={users} />;
}
