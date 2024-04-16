import { auth } from "@clerk/nextjs";

import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  return (
    <>
      <Navbar userId={userId} />
      {children}
      <Footer />
    </>
  );
}
