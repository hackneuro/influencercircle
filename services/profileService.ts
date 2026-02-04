import { supabase } from "@/lib/supabaseClient";
import type { ProfileRow } from "@/types/database";
import { getCurrentUser } from "./authService";

export type OnboardingProfileInput = {
  username: string;
  name: string;
  email: string;
  whatsapp: string;
  city?: string;
  state?: string;
  country?: string;
  linkedin_url?: string;
  instagram_url?: string;
  objective?: string;
  market_objective?: string;
  location_objective?: string;
  average_content_price?: number;
  about_yourself?: string;
  plan?: "member" | "elite" | "advisor";
  advisor_sub_choices?: string[];
  influencer_channels?: string[];
  student_level?: string[];
  company_type?: string[];
  investor_type?: string[];
  executive_experience?: string[];
  user_types?: string[];
  region?: string;
  disclaimer_accepted?: boolean;
  is_visible?: boolean;
  campaign_preference?: string;
  social_cause_preference?: string;
  role?: "user" | "influencer" | "admin";
  image?: string;
  resume_url?: string;
  show_email?: boolean;
  show_phone?: boolean;
};

export async function upsertProfileFromOnboarding(input: OnboardingProfileInput) {
  const user = await getCurrentUser();
  const payload: any = {
    id: user.id,
    username: input.username,
    name: input.name,
    email: input.email,
    whatsapp: input.whatsapp,
    city: input.city,
    state: input.state,
    country: input.country,
    linkedin_url: input.linkedin_url,
    instagram_url: input.instagram_url,
    objective: input.objective,
    market_objective: input.market_objective,
    location_objective: input.location_objective,
    average_content_price: input.average_content_price ?? null,
    about_yourself: input.about_yourself,
    plan: input.plan ?? "member",
    advisor_sub_choices: input.advisor_sub_choices ?? [],
    influencer_channels: input.influencer_channels ?? [],
    student_level: input.student_level ?? [],
    company_type: input.company_type ?? [],
    investor_type: input.investor_type ?? [],
    executive_experience: input.executive_experience ?? [],
    user_types: input.user_types ?? [],
    region: input.region ?? null,
    disclaimer_accepted: !!input.disclaimer_accepted,
    campaign_preference: input.campaign_preference,
    social_cause_preference: input.social_cause_preference,
    is_public: input.is_visible ?? true,
    show_email: input.show_email ?? false,
    show_phone: input.show_phone ?? false,
    role: input.role ?? "user"
  };

  if (input.image) payload.image = input.image;
  if (input.resume_url) payload.resume_url = input.resume_url;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    const anyError = error as any;
    if (anyError.code === "23505") {
      throw new Error("This username is already taken. Please choose another one.");
    }
    throw new Error(error.message || "Failed to save profile");
  }

  return data as ProfileRow;
}

export async function getPublicProfile(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to load profile");
  }

  return data as ProfileRow | null;
}

export async function getMyProfile() {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    // If error is "Not authenticated", return null
    if (error.message.includes("Auth session missing")) return null;
    throw new Error(error.message || "Failed to load profile");
  }
  return data as ProfileRow | null;
}
