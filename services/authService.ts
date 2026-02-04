import { supabase } from "@/lib/supabaseClient";

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message || "Failed to get current user");
  }
  const user = data?.user;
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
}

