import { t } from "../trpc";

export const exampleRouter = t.router({
  ping: t.procedure.query(() => {
    return "pong";
  }),
});
