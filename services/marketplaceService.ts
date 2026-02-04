import { supabase } from "@/lib/supabaseClient";
import type { ServiceRow, ProfileRow } from "@/types/database";

export async function getPlatformProducts(): Promise<ServiceRow[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .is("owner_id", null)
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    throw new Error(error.message || "Failed to load products");
  }

  return (data ?? []) as ServiceRow[];
}

export async function getInfluencers(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "influencer")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to load influencers");
  }

  return (data ?? []) as ProfileRow[];
}

