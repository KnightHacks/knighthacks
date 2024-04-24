import { t } from "./init";
import {
  hasApplied,
  hasProfile,
  isAdmin,
  isAuthenticated,
} from "./middlewares";

// Public procedures don't require a token
export const publicProcedure = t.procedure;

// Admin procedures require a user witth a knighthacks.org email
export const adminProcedure = publicProcedure.use(isAdmin);

// Authenticated procedures require a valid token
export const authenticatedProcedure = publicProcedure.use(isAuthenticated);

// Profile procedures require a user with a profile
export const profileProcedure = authenticatedProcedure.use(hasProfile);

// Hacker procedures require a user to have applied to the current hackathon
export const applicationProcedure = profileProcedure.use(hasApplied);
