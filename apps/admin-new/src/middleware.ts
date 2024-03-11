import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
  afterAuth: async (auth, req) => {
    // If the user is not signed in and is trying to access an unauthorized route, redirect to sign in
    if (req.nextUrl.pathname === "/unauthorized" && !auth.userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // If the user is not signed in, redirect to sign in
    if (!auth.userId && !auth.isPublicRoute) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // If the user is signed in, but is not authorized, redirect to unauthorized
    if (
      auth.userId &&
      !auth.sessionClaims?.email.endsWith("@knighthacks.org") &&
      req.nextUrl.pathname !== "/unauthorized"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // If the user is signed in and authorized, allow the request
    if (auth.userId && !auth.isPublicRoute) return NextResponse.next();

    // If the user is not signed in and the route is public, allow the request
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
