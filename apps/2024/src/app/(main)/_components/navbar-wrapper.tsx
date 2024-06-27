import { auth } from "@clerk/nextjs/server";

import { Navbar } from "./navbar";

export function NavbarWrapper() {
  const { userId } = auth();
  return <Navbar userId={userId} />;
}
