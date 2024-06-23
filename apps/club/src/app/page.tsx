import { currentUser } from "@clerk/nextjs/server";

import { SignOut } from "./_components/sign-out";

export default async function Home() {
  const user = await currentUser();
  return (
    <div>
      <h1>This is the home page</h1>
      {user && <SignOut />}
    </div>
  );
}
