import { trpc } from "@/trpc";

export function Users() {
  const { data, error, isLoading } = trpc.users.allUsers.useQuery();

  if (error) return <div>Error: {error.message}</div>;

  if (isLoading) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}
