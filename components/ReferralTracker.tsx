"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

function safeSetCookie(name: string, value: string) {
  try {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  } catch {}
}

function safeGetCookie(name: string) {
  try {
    const parts = document.cookie.split(";").map((p) => p.trim());
    const found = parts.find((p) => p.startsWith(`${encodeURIComponent(name)}=`));
    if (!found) return "";
    return decodeURIComponent(found.split("=").slice(1).join("="));
  } catch {
    return "";
  }
}

function safeLocalGet(key: string) {
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function safeLocalSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

export default function ReferralTracker() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const ref = url.searchParams.get("ref") || url.searchParams.get("referral") || "";
    if (ref) safeSetCookie("ic_ref_code", ref);
    const campaign = url.searchParams.get("campaign") || "";
    if (campaign) safeSetCookie("ic_ref_campaign", campaign);
  }, []);

  useEffect(() => {
    (async () => {
      const refCode = safeGetCookie("ic_ref_code");
      const campaignCode = safeGetCookie("ic_ref_campaign");
      if (!refCode && !campaignCode) return;

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || "";
      const token = session?.access_token || "";
      if (!userId || !token) return;

      const already = safeLocalGet(`ic_ref_claimed:${userId}`);
      if (already === "1") return;

      const res = await fetch("/api/referrals/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          referral_code: refCode || undefined,
          campaign_code: campaignCode || undefined
        })
      });

      if (res.ok) {
        safeLocalSet(`ic_ref_claimed:${userId}`, "1");
      }
    })();
  }, []);

  return null;
}

