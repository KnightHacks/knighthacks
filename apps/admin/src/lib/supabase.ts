import { createClient } from "@supabase/supabase-js";

/*
  Do not use this client to make database calls directly.
  It is not type safe. Instead, use the trpc client.
*/
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_PROJECT_API_KEY
);
