import { Link } from "wouter";
export function Nav() {
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
        <li>
          <Link href="/signin">Sign In</Link>
        </li>
      </ul>
    </div>
  );
}
