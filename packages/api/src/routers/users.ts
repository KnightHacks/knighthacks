import { t } from "../trpc";

export const usersRouter = t.router({
  getAll: t.procedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany();
  }),
});
