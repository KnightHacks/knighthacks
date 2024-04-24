import { t } from "./init";
import { hasProfile, isAdmin, isAuthenticated } from "./middlewares";

// Public procedures don't require a token
export const publicProcedure = t.procedure;

// Admin procedures require a user witth a knighthacks.org email
export const adminProcedure = publicProcedure.use(isAdmin);

// Authenticated procedures require a valid token
export const authenticatedProcedure = publicProcedure.use(isAuthenticated);

// Profile procedures require a user with a profile
export const profileProcedure = authenticatedProcedure.use(hasProfile);
