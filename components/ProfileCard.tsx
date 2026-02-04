"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types";
import { User } from "lucide-react";

export default function ProfileCard() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const id = userData.user?.id;
      if (!id) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      if (data) setProfile(data as Profile);
    })();
  }, []);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-ic-accent flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">{profile?.name ?? "Your Profile"}</h3>
          <p className="text-sm text-ic-subtext">{profile?.email ?? "Not signed in"}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="card p-4">
          <p className="text-ic-subtext">WhatsApp</p>
          <p className="font-medium">{profile?.whatsapp ?? "-"}</p>
        </div>
        <div className="card p-4">
          <p className="text-ic-subtext">Location</p>
          <p className="font-medium">{[profile?.city, profile?.state, profile?.country].filter(Boolean).join(", ") || "-"}</p>
        </div>
        <div className="card p-4">
          <p className="text-ic-subtext">Plan</p>
          <p className="font-medium uppercase">{profile?.plan ?? "-"}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
        <div className="card p-4">
          <p className="text-ic-subtext">LinkedIn</p>
          <a className="text-ic-accent underline" href={profile?.linkedin_url ?? "#"} target="_blank">Profile</a>
        </div>
        <div className="card p-4">
          <p className="text-ic-subtext">Instagram</p>
          <a className="text-ic-accent underline" href={profile?.instagram_url ?? "#"} target="_blank">Profile</a>
        </div>
      </div>
    </div>
  );
}

