import { type AppRouter } from '@knighthacks/api';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
