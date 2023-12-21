import { SignOutButton, useAuth } from "@clerk/clerk-react";
import { Link } from "wouter";

export function Navigation() {
  const { isSignedIn } = useAuth();

  return (
    <div className="m-4">
      <ul>
        <li>
          <Link href="/">Overview</Link>
        </li>
        <li>
          <Link href="/users">Users</Link>
        </li>
        <li>
          <Link href="/hackers">Hackers</Link>
        </li>
        <li>
          <Link href="/hackathons">Hackathons</Link>
        </li>
        {isSignedIn && (
          <li>
            <SignOutButton />
          </li>
        )}
      </ul>
    </div>
  );
}
