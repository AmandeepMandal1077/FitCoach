import { createClient } from "@/lib/supabase/server";

/**
 * Returns the current user or throws a 401-able error.
 * Use in every API route to guard endpoints.
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user;
}
