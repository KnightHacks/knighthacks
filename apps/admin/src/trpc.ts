import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "api";

export const trpc = createTRPCReact<AppRouter>();
