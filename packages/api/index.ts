import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "./src/routers";

export { type TRPCContext } from "./src/context";
export { type AppRouter };

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
