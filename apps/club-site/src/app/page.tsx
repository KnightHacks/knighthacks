import { currentUser } from "@clerk/nextjs";

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
