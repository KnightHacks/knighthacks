import { Link } from "wouter";
import { supabase } from "../supabase";
import { useSessionStore } from "../stores/session-store";

export function Nav() {
  const { session } = useSessionStore();

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
        {session ? (
          <li>
            <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
          </li>
        ) : (
          <li>
            <Link href="/signin">Sign In</Link>
          </li>
        )}
      </ul>
    </div>
  );
}
