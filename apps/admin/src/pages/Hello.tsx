import { trpc } from "../lib/trpc.ts";

export function Hello() {
  const { data, error, isLoading } = trpc.hello.useQuery();

  if (error) return <div>Error: {error.message}</div>;

  if (isLoading) return <div>Loading...</div>;

  return <div>{data}</div>;
}
