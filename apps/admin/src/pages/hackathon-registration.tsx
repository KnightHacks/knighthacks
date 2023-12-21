import { Redirect } from "wouter";

import { trpc } from "~/lib/trpc";

export function HackathonRegistration() {
  const { data: currentUser, isLoading } = trpc.users.getCurrentUser.useQuery();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!currentUser) {
    return <Redirect to="/hackathon/account-registration" />;
  }

  return <></>;
}
