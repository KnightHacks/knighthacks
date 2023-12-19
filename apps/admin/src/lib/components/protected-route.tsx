import { Redirect, Route, type RouteProps } from 'wouter';
import { useSessionStore } from '../stores/session-store';

export function ProtectedRoute(props: RouteProps) {
  const { session } = useSessionStore();

  if (!session) {
    return <Redirect to="/signin" />;
  }

  return <Route {...props} />;
}
