import { currentUser } from "@clerk/nextjs";

import { SignOut } from "../_components/sign-out";

export const runtime = "edge";

export default async function Home() {
  const user = await currentUser();

  return (
    <div>
      <div>This is the home page!</div>
      {user && <SignOut />}
    </div>
  );
}
