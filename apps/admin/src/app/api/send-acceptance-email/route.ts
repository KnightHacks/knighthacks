import { renderEmailAcceptance } from "@knighthacks/utils";
import { z } from "@knighthacks/validators";
import { Resend } from "resend";

import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export const runtime = "edge";

const user = z.object({
  id: z.number(),
  email: z.string().min(1, { message: "Required" }).email("Invalid email"),
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Rquired" }),
  clerkID: z.string().min(1, { message: "Required" }),
});

export async function POST(request: Request) {
  const body = (await request.json()) as Response;
  const input = user.parse(body);

  try {
    const { data, error } = await resend.emails.send({
      from: "status@knighthacks.org",
      to: input.email,
      subject: "Knighthacks Acceptance",
      html: renderEmailAcceptance(input.firstName),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
