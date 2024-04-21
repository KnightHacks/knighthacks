import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isUnauthRoute = createRouteMatcher(["/unauthorized(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// All routes are protected except for sign-in, sign-up, and unauthorized
const isProtectedRoute = createRouteMatcher(["/(.*)"]);

export default clerkMiddleware((auth, req) => {
  // If the user is not signed in and is trying to access an unauthorized route, redirect to sign in
  if (isUnauthRoute(req) && !auth().userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If the user is not signed in, redirect to sign in
  if (!auth().userId && isProtectedRoute(req) && !isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If the user is signed in, but is not authorized, redirect to unauthorized
  if (
    auth().userId &&
    !auth().sessionClaims?.email.endsWith("@knighthacks.org") &&
    isProtectedRoute(req) && !isUnauthRoute(req)
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // If the user is signed in and authorized, allow the request
  if (auth().userId && isProtectedRoute(req) && !isAuthRoute(req))
    return NextResponse.next();

  // If the user is not signed in and the route is public, allow the request
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
