import { auth } from "@clerk/nextjs/server";
import {
  createTRPCProxyClient,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@knighthacks/api";

const createTRPCProxyClientWrapper = () => {
  const { getToken } = auth();

  return createTRPCProxyClient<AppRouter>({
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
};

export const trpc = createTRPCProxyClientWrapper();
