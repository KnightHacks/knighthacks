import { t } from "../trpc";

export const exampleRouter = t.router({
  ping: t.procedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany();
  }),
});
