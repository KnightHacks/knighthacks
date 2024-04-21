import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isApplicationRoute = createRouteMatcher(["/application(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isApplicationRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
