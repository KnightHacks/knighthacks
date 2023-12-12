import { users } from "db/schemas";
import { t } from "../trpc";

export const usersRouter = t.router({
  allUsers: t.procedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany();
  }),
});
