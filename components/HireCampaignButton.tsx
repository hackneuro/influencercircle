"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ObjectiveType =
  | "Brand Campaign"
  | "Informational Campaign"
  | "Sales Campaign"
  | "Hire him/her for Project/ Consultant/ Fixed Job Position"
  | "Other";

type Props = {
  targetUsername: string;
  targetName: string;
  targetProfileId: string;
};

function normalizeUrl(input: string) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

export default function HireCampaignButton({ targetUsername, targetName, targetProfileId }: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState({
    company_or_person: "",
    email: "",
    phone: "",
    website: "",
    linkedin_page: "",
    instagram_page: "",
    objective_type: "Brand Campaign" as ObjectiveType,
    pay_per_message: "",
    want_other_talent: "NO" as "YES" | "NO",
    total_budget: "",
    currency: ""
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setSent(false);
      setSending(false);
      setError("");
    }
  }, [open]);

  const canSend = useMemo(() => {
    return (
      form.company_or_person.trim().length > 1 &&
      form.email.trim().length > 3 &&
      form.phone.trim().length > 3 &&
      form.pay_per_message.trim().length > 0 &&
      form.total_budget.trim().length > 0
    );
  }, [form]);

  async function submit() {
    if (sending) return;
    setError("");
    setSending(true);
    try {
      const payload = {
        target_username: targetUsername,
        target_name: targetName,
        target_profile_id: targetProfileId,
        company_or_person: form.company_or_person.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        website: normalizeUrl(form.website),
        linkedin_page: normalizeUrl(form.linkedin_page),
        instagram_page: normalizeUrl(form.instagram_page),
        objective_type: form.objective_type,
        pay_per_message: Number(form.pay_per_message),
        want_other_talent: form.want_other_talent === "YES",
        total_budget: Number(form.total_budget),
        currency: form.currency.trim().slice(0, 10)
      };

      const res = await fetch("/api/public/hire-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Failed to send request.");
      }
      setSent(true);
    } catch (e: any) {
      setError(String(e?.message || "Failed to send request."));
    } finally {
      setSending(false);
    }
  }

  const modal = open ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="text-lg font-bold text-slate-900">Hire this person for a campaign</div>
            <div className="text-xs text-slate-500">@{targetUsername} · {targetName}</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="h-9 w-9 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">
          {sent ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-green-800 font-semibold">
              We received your briefing for this campaign request and we will get back to you soon.
            </div>
          ) : (
            <div className="space-y-4">
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Name of your company/ person</label>
                  <input
                    className="input w-full bg-slate-50 border-slate-200"
                    value={form.company_or_person}
                    onChange={(e) => setForm((p) => ({ ...p, company_or_person: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    className="input w-full bg-slate-50 border-slate-200"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Phone</label>
                  <input
                    className="input w-full bg-slate-50 border-slate-200"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Website (optional)</label>
                  <input
                    className="input w-full bg-slate-50 border-slate-200"
                    value={form.website}
                    onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">LinkedIn Page (optional)</label>
                  <input
                    className="input w-full bg-slate-50 border-slate-200"
                    value={form.linkedin_page}
                    onChange={(e) => setForm((p) => ({ ...p, linkedin_page: e.target.value }))}
                    placeholder="https://"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Instagram page (optional)</label>
                  <input
                    className="input w-full bg-slate-50 border-slate-200"
                    value={form.instagram_page}
                    onChange={(e) => setForm((p) => ({ ...p, instagram_page: e.target.value }))}
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">What is your objective?</label>
                <select
                  className="input w-full bg-slate-50 border-slate-200"
                  value={form.objective_type}
                  onChange={(e) => setForm((p) => ({ ...p, objective_type: e.target.value as ObjectiveType }))}
                >
                  <option value="Brand Campaign">Brand Campaign</option>
                  <option value="Informational Campaign">Informational Campaign</option>
                  <option value="Sales Campaign">Sales Campaign</option>
                  <option value="Hire him/her for Project/ Consultant/ Fixed Job Position">Hire him/her for Project/ Consultant/ Fixed Job Position</option>
                  <option value="Other">Other (or you don't know yet)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Value that you want to pay per message</label>
                  <input
                    className="input w-full bg-slate-50 border-slate-200"
                    value={form.pay_per_message}
                    onChange={(e) => setForm((p) => ({ ...p, pay_per_message: e.target.value.replace(/[^\d.]/g, "") }))}
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Do you want to hire other influencers/ Executives?</label>
                  <select
                    className="input w-full bg-slate-50 border-slate-200"
                    value={form.want_other_talent}
                    onChange={(e) => setForm((p) => ({ ...p, want_other_talent: e.target.value as "YES" | "NO" }))}
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Total budget for the campaign</label>
                  <input
                    className="input w-full bg-slate-50 border-slate-200"
                    value={form.total_budget}
                    onChange={(e) => setForm((p) => ({ ...p, total_budget: e.target.value.replace(/[^\d.]/g, "") }))}
                    inputMode="decimal"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Place here what currency your want to apply (ex. USD, or R$, or EU$, colombian pesos, AR$, etc.)</label>
                <input
                  className="input w-full bg-slate-50 border-slate-200"
                  value={form.currency}
                  maxLength={10}
                  onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value.slice(0, 10) }))}
                  placeholder="USD"
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button onClick={() => setOpen(false)} className="btn btn-outline">
            Close
          </button>
          {!sent ? (
            <button
              onClick={submit}
              disabled={!canSend || sending}
              className="btn bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold disabled:opacity-60 disabled:hover:bg-blue-600"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold w-full"
      >
        Hire this person for a campaign
      </button>
      {mounted ? createPortal(modal, document.body) : null}
    </>
  );
}
