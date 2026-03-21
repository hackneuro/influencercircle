"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Copy, Plus } from "lucide-react";
import { toast } from "sonner";

type Summary = {
  totals: { level1: number; level2: number; level3: number };
  layer1: Array<{ id: string; name: string; username: string | null; created_at: string }>;
  layer2Count: number;
  layer3Count: number;
};

type Campaign = {
  id: string;
  code: string;
  title: string;
  location: string | null;
  show_inviter_name: boolean;
  created_at: string;
};

export default function ReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [creating, setCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ title: "", location: "", show_inviter_name: true });

  const baseLink = useMemo(() => {
    if (!referralCode) return "";
    return `https://www.influencercircle.net/r/${referralCode}`;
  }, [referralCode]);

  async function authedFetch(path: string, init?: RequestInit) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(path, {
      ...(init || {}),
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`
      }
    });
    return res;
  }

  async function load() {
    setLoading(true);
    try {
      const meRes = await authedFetch("/api/referrals/me");
      const meJson = await meRes.json();
      if (meRes.ok) setReferralCode(String(meJson.referral_code || ""));
      else toast.error(meJson?.error || "Failed to load referral code");

      const sumRes = await authedFetch("/api/referrals/summary");
      const sumJson = await sumRes.json();
      if (sumRes.ok) setSummary(sumJson);

      const campRes = await authedFetch("/api/referrals/campaigns");
      const campJson = await campRes.json();
      if (campRes.ok) setCampaigns(Array.isArray(campJson.campaigns) ? campJson.campaigns : []);
      else toast.error(campJson?.error || "Failed to load referral campaigns");
    } catch (e: any) {
      toast.error(String(e?.message || "Failed to load referrals"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }

  async function createCampaign() {
    if (!newCampaign.title.trim()) {
      toast.error("Please add a title");
      return;
    }
    setCreating(true);
    try {
      const res = await authedFetch("/api/referrals/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCampaign.title.trim(),
          location: newCampaign.location.trim(),
          show_inviter_name: newCampaign.show_inviter_name
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json?.error || "Failed to create campaign link");
        return;
      }
      if (json.campaign) {
        setCampaigns((p) => [json.campaign, ...p]);
        setNewCampaign({ title: "", location: "", show_inviter_name: true });
        toast.success("Referral campaign link created");
      }
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-2 text-slate-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Referral Circle</h1>
          <p className="text-slate-500 mt-1">Share your link. Earn from 3 layers when referrals pay.</p>
        </div>
        <button className="btn btn-outline" onClick={load}>
          Refresh
        </button>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="text-sm font-bold text-slate-900">Your referral link</div>
        <div className="flex gap-2">
          <input className="input flex-1 bg-slate-50 border-slate-200 font-mono text-sm" value={baseLink} readOnly />
          <button className="btn btn-outline flex items-center gap-2" onClick={() => copy(baseLink)} disabled={!baseLink}>
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs text-slate-500 font-bold uppercase">Layer 1 earnings</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{summary?.totals.level1?.toFixed(2) ?? "0.00"}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs text-slate-500 font-bold uppercase">Layer 2 earnings</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{summary?.totals.level2?.toFixed(2) ?? "0.00"}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs text-slate-500 font-bold uppercase">Layer 3 earnings</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{summary?.totals.level3?.toFixed(2) ?? "0.00"}</div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-slate-900">Invited Members</div>
            <div className="text-sm text-slate-500">
              Layer 1: {summary?.layer1?.length ?? 0} · Layer 2: {summary?.layer2Count ?? 0} · Layer 3: {summary?.layer3Count ?? 0}
            </div>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {(summary?.layer1 || []).length === 0 ? (
            <div className="py-4 text-sm text-slate-500">No invites yet.</div>
          ) : (
            (summary?.layer1 || []).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">@{p.username || "unknown"}</div>
                </div>
                <div className="text-xs text-slate-500 shrink-0">
                  {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="text-lg font-bold text-slate-900">Referral Campaign Links</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-1">
            <div className="text-sm font-bold text-slate-700">Title</div>
            <input
              className="input w-full bg-slate-50 border-slate-200"
              placeholder="Financial Executives, Oncologists Doctors, AI Influencers, etc."
              value={newCampaign.title}
              onChange={(e) => setNewCampaign((p) => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <div className="text-sm font-bold text-slate-700">Location</div>
            <input
              className="input w-full bg-slate-50 border-slate-200"
              placeholder="New York, NY, USA; Sao Paulo, SP, Brazil; Buenos Aires, Argentina; Munmbai, India; etc."
              value={newCampaign.location}
              onChange={(e) => setNewCampaign((p) => ({ ...p, location: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <div className="text-sm font-bold text-slate-700">Show inviter name</div>
            <select
              className="input w-full bg-slate-50 border-slate-200"
              value={newCampaign.show_inviter_name ? "yes" : "no"}
              onChange={(e) => setNewCampaign((p) => ({ ...p, show_inviter_name: e.target.value === "yes" }))}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <button
          className="btn bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold flex items-center gap-2"
          onClick={createCampaign}
          disabled={creating}
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create a Referall Campagin link to increase conversion
        </button>

        <div className="divide-y divide-slate-100">
          {campaigns.length === 0 ? (
            <div className="py-4 text-sm text-slate-500">No campaigns yet.</div>
          ) : (
            campaigns.map((c) => {
              const link = `https://www.influencercircle.net/ref/${c.code}`;
              return (
                <div key={c.id} className="py-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{c.title}</div>
                      <div className="text-xs text-slate-500 truncate">{c.location || "No location"}</div>
                    </div>
                    <button className="btn btn-outline flex items-center gap-2" onClick={() => copy(link)}>
                      <Copy className="h-4 w-4" />
                      Copy link
                    </button>
                  </div>
                  <input className="input w-full bg-slate-50 border-slate-200 font-mono text-sm" value={link} readOnly />
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
