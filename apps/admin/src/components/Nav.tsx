import { Link } from "wouter";
import { useAuth0 } from "@auth0/auth0-react";

export function Nav() {
  const { isAuthenticated, logout } = useAuth0();

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
        {isAuthenticated ? (
          <li>
            <button
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: window.location.origin,
                  },
                })
              }
            >
              Log out
            </button>
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
