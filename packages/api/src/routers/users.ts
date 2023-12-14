import { insertUserSchema, users } from "db/schemas";
import { adminProcedure, publicProcedure, router } from "../trpc";
import { eq } from "db";

export const usersRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany();
  }),
  register: publicProcedure
    .input(insertUserSchema)
    .mutation(async ({ ctx, input }) => {
      // If the user already exists, throw an error
      if (input.email) {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.email, input.email),
        });
        if (user) {
          throw new Error("User already exists");
        }
      }
      return await ctx.db.insert(users).values(input);
    }),
});
