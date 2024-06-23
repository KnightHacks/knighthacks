"use client";

import { useState } from "react";
import { Button } from "@knighthacks/ui/button";
import { Sheet, SheetContent } from "@knighthacks/ui/sheet";

import { api } from "~/trpc";
import { DataTable } from "../_components/data-table";
import { CreateUserForm } from "./create-user-form";
import { userColumns } from "./user-columns";

export const runtime = "edge";

export default function Users() {
  const [createUserFormSheetOpen, setCreateUserFormSheetOpen] = useState(false);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Button onClick={() => setCreateUserFormSheetOpen(true)}>
            Create User
          </Button>
        </div>
        <UsersTable />
      </div>
      <Sheet
        open={createUserFormSheetOpen}
        onOpenChange={setCreateUserFormSheetOpen}
      >
        <SheetContent>
          <CreateUserForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function UsersTable() {
  const { data: users, isPending, error } = api.user.adminAll.useQuery();

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={userColumns} data={users} />;
}
