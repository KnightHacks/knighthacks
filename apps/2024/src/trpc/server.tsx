import "server-only";

import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { createTRPCClient, unstable_httpBatchStreamLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@knighthacks/api";

const getToken = cache(() => auth().getToken());

export const trpc = createTRPCClient<AppRouter>({
  links: [
    unstable_httpBatchStreamLink({
      transformer: superjson,
      url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
      async headers() {
        return {
          Authorization: `Bearer ${await getToken()}`,
        };
      },
    }),
  ],
});
