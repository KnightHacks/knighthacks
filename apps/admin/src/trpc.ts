import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@knighthacks/api";

export const trpc = createTRPCReact<AppRouter>();
