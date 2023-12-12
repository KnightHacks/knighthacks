import { useAuth0 } from "@auth0/auth0-react";

export function Overview() {
  const { user } = useAuth0();

  return <div>{JSON.stringify(user)}</div>;
}
