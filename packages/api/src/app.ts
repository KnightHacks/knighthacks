import { Context, Hono, Next } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers";
import { cors } from "hono/cors";
import { createContext } from "./context";
import { githubAuth, GitHubUser } from "@hono/oauth-providers/github";
import { decode, sign, jwt, verify } from "hono/jwt";
import { connect, eq } from "db";
import { prettyJSON } from "hono/pretty-json";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { users } from "db/schemas";

export type Bindings = {
  DATABASE_URL: string;
  GITHUBID: string;
  GITHUB_SECRET: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (c) => {
  console.log(c.req.raw);
  return c.text("Hello world");
});

app.use("*", prettyJSON());

app.use("/trpc/*", async (c, next) => {
  const middleware = trpcServer({
    router: appRouter,
    onError({ error }) {
      console.error(error);
    },
    createContext: createContext(c.env),
  });
  return await middleware(c, next);
});

app.get("/auth/github", githubAuth({ oauthApp: true }), async (c) => {
  const db = connect(c.env.DATABASE_URL);

  // @ts-ignore
  const user: GitHubUser = c.get("user-github"); // This produces a type error
  console.log(user);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  if (existingUser && existingUser.oauthProvider !== "github") {
    return c.text(
      "This account is already registered with a different oauth provider"
    );
  }

  if (!existingUser) {
    // Create a new user filling in the fields we can get from github
    await db.insert(users).values({
      name: user.name,
      oauthId: user.id.toString(),
      oauthProvider: "github",
      email: user.email,
      github: user.email,
    });

    const oauthToken = await sign(
      {
        id: user.id,
        // Expire in 1 hour
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      c.env.JWT_SECRET
    );

    setCookie(c, "oauthToken", oauthToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      // 1 hour
      maxAge: 60 * 60,
    });
    // The github auth middleware sets a cookie called "state" that we don't need anymore at this point
    deleteCookie(c, "state");

    return c.redirect("http://localhost:3000");
  }
});

export { app };
