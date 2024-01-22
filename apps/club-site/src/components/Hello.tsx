"use client";

import { trpc } from "~/trpc";

export function Hello() {
  const { data, error, isLoading } = trpc.hello.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <div>{data}</div>;
}
