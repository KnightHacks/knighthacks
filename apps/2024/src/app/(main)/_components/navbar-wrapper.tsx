import { auth } from "@clerk/nextjs/server";

import { Navbar } from "./navbar";

export async function NavbarWrapper() {
  const { userId } = auth();
  return <Navbar userId={userId} />;
}
