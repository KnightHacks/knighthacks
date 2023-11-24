import { t } from "../trpc";

export const exampleRouter = t.router({
  ping: t.procedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany();
  }),
});
