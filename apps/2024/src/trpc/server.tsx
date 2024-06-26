import "server-only";

import type { AppRouter } from "@knighthacks/api";
import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { createTRPCClient, unstable_httpBatchStreamLink } from "@trpc/client";
import superjson from "superjson";

import { env } from "~/env";

const getToken = cache(() => auth().getToken());

export const trpc = createTRPCClient<AppRouter>({
  links: [
    unstable_httpBatchStreamLink({
      transformer: superjson,
      url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
      async headers() {
        const nh = headers();
        const h = new Headers(nh);
        h.append("origin", nh.get("x-forwarded-host") ?? "");
        h.append("Authorization", `Bearer ${await getToken()}`);
        return h;
      },
    }),
  ],
});
