import { z } from "zod";
import { publicProcedure } from "../procedures";
import type { TRPCRouterRecord } from "@trpc/server";
// import { renderEmailAcceptance} from "@knighthacks/utils";

const user = z.object({
    id: z.number(),
    email: z.string().min(1, { message: "Required" }).email("Invalid email"),
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Rquired" }),
  clerkID: z.string().min(1, { message: "Required" }),
})

export const emailRouter = {
  sendAcceptanceEmail: publicProcedure
  .input(user)
  .mutation(async ({ ctx, input }) => {
    console.log("input: ", input.email)
    await ctx.resend.emails.send({
        from: "status@knighthacks.org",
        to: input.email,
        subject: "Knighthacks Acceptance",
        html: "lol",
      })
  }),
} satisfies TRPCRouterRecord;