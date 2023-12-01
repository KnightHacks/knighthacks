import { handle } from "hono/vercel";
import { app } from "../src/app";

export const config = {
  runtime: "edge",
};

export default handle(app);
