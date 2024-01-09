
import type { RouterOutput } from "@knighthacks/api";
import { trpc } from "~/trpc";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./hackathon-columns";

export function HackathonTable() {
  const { data: hackathons, isLoading, error } = trpc.hackathons.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={columns} data={hackathons} />;

}