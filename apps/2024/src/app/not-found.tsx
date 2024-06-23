import Link from "next/link";
import { Button } from "@knighthacks/ui/button";

export const runtime = "edge";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen flex-col justify-center">
      <h1 className="mb-2 text-3xl font-bold">Oops!</h1>
      <p className="mb-4">Looks like you&apos;ve gone adrift!</p>
      <Link href="/" passHref legacyBehavior>
        <Button>Sail back home</Button>
      </Link>
    </div>
  );
}
