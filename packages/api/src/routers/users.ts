import { privateProcedure, router } from "../trpc";

export const usersRouter = router({
  getAll: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany();
  }),
});
