import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from './src/routers';

export { type TRPCContext } from './src/context';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export { type AppRouter } from './src/routers';
