import { DataTable } from "~/components/ui/data-table";
import { trpc } from "~/trpc";
import { columns } from "./hackathon-columns";

export function displayHackathons() {
  //const utils = trpc.useUtils();

  let hackathonData = trpc.hackathons.getAll.useQuery().data;
  return (
    // <div>
    //   {hackathonData
    //     ? hackathonData.map((hackathon, idx) => (
    //         <div key={idx}>
    //           <h1 key={idx + 1}>{hackathon.name}</h1>
    //           <p key={idx + 2}>{hackathon.startDate}</p>
    //           <p key={idx + 3}>{hackathon.endDate}</p>
    //           <br></br>
    //         </div>
    //       ))
    //     : "No hackathons.."}
    // </div>
    <HackathonsTable></HackathonsTable>
  );
}

export function HackathonsTable() {
  const {
    data: hackathons,
    isLoading,
    error,
  } = trpc.hackathons.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={columns} data={hackathons} />;
}
