import { trpc } from "~/trpc";

export function displayHackathons() {
  //const utils = trpc.useUtils();

  let hackathonData = trpc.hackathons.getAll.useQuery().data;
  return (
    <div>
      {hackathonData
        ? hackathonData.map((hackathon, idx) => (
            <div key={idx}>
              <h1 key={idx + 1}>{hackathon.name}</h1>
              <p key={idx + 2}>{hackathon.startDate}</p>
              <p key={idx + 3}>{hackathon.endDate}</p>
              <br></br>
            </div>
          ))
        : "No hackathons.."}
    </div>
  );
}
