import "server-only";

import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { createTRPCClient, unstable_httpBatchStreamLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@knighthacks/api";

const getToken = cache(() => auth().getToken());

export const trpc = createTRPCClient<AppRouter>({
  transformer: superjson,
  links: [
    unstable_httpBatchStreamLink({
      url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
      async headers() {
        const token = await getToken();
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});
