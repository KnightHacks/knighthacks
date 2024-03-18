import { useState } from "react";

import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { trpc } from "~/trpc";
import { AddUserForm } from "./add-user-form";
import { columns } from "./user-columns";

export function Users() {
  const [addUserFormSheetOpen, setAddUserFormSheetOpen] = useState(false);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Button onClick={() => setAddUserFormSheetOpen(true)}>
            Add User
          </Button>
        </div>
        <UserTable />
      </div>
      <Sheet open={addUserFormSheetOpen} onOpenChange={setAddUserFormSheetOpen}>
        <SheetContent>
          <AddUserForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function UserTable() {
  const { data: users, isLoading, error } = trpc.users.all.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={columns} data={users} />;
}
