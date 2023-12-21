import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./trpc/routers";

export { type TRPCContext } from "./trpc/context";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export { type AppRouter } from "./trpc/routers";
