import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export async function verifyAccess(c: Context, next: Next) {
  const token = c.req.header("authorization")?.split(" ")[1];

  if (!token) {
    return c.text("No token", 401);
  }

  try {
    await verify(token, c.env.SUPABASE_JWT_SECRET);
  } catch (e) {
    console.error(e);
    return c.text("Invalid token", 401);
  }

  await next();
}
