import { z } from "zod";

import {
  asc,
  eq,
  hackathons,
  insertSponsorSchema,
  sponsors,
} from "@knighthacks/db";

import { router } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";
import { db } from "../../middlewares";

export const sponsorsRouter = router({
    add: adminProcedure
        .input(insertSponsorSchema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.insert(sponsors).values({ ...input });
        }),
    getAll: adminProcedure
        .query(async ({ctx}) => {
            return ctx.db.query.sponsors.findMany()
        })
});