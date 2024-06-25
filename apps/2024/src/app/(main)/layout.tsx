import { Footer } from "./_components/footer";
import { NavbarWrapper } from "./_components/navbar-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarWrapper />
      {children}
      <Footer />
    </>
  );
}
