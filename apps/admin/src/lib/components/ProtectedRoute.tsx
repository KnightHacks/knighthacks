import { Redirect, Route, RouteProps } from "wouter";
import { useSession } from "../hooks/useSession";

export function ProtectedRoute(props: RouteProps) {
  const { session, isFetchingSession } = useSession();

  if (isFetchingSession) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Redirect to="/signin" />;
  }

  return <Route {...props} />;
}
