"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { SsiHistory } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

type Snapshot = SsiHistory;

function percentChange(curr: number, prev: number | null) {
  if (prev === null || prev === 0) return null;
  return Math.round(((curr - prev) / prev) * 100);
}

export default function SsiTracker() {
  const [userId, setUserId] = useState<string | null>(null);
  const [entries, setEntries] = useState<Snapshot[]>([]);
  const [today, setToday] = useState<Snapshot | null>(null);
  const [form, setForm] = useState({
    total_ssi: 0,
    brand_score: 0,
    people_score: 0,
    insight_score: 0,
    relation_score: 0
  });

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const id = userData.user?.id ?? null;
      setUserId(id);
      if (!id) return;
      const { data } = await supabase
        .from("ssi_history")
        .select("*")
        .eq("user_id", id)
        .order("date", { ascending: false });
      const list = (data ?? []) as Snapshot[];
      setEntries(list);
      const todayStr = new Date().toISOString().slice(0, 10);
      const t = list.find((e) => e.date === todayStr) ?? null;
      setToday(t);
    })();
  }, []);

  const prevs = useMemo(() => {
    const daysAgo = (n: number) => {
      const d = new Date();
      d.setDate(d.getDate() - n);
      return d.toISOString().slice(0, 10);
    };
    const findDate = (iso: string) => entries.find((e) => e.date === iso) ?? null;
    const yesterday = findDate(daysAgo(1));
    const lastWeek = findDate(daysAgo(7));
    const lastMonth = findDate(daysAgo(30));
    return { yesterday, lastWeek, lastMonth };
  }, [entries]);

  const comparisons = useMemo(() => {
    const curr = today?.total_ssi ?? null;
    const y = prevs.yesterday?.total_ssi ?? null;
    const w = prevs.lastWeek?.total_ssi ?? null;
    const m = prevs.lastMonth?.total_ssi ?? null;
    return {
      yesterday: curr !== null ? percentChange(curr, y) : null,
      lastWeek: curr !== null ? percentChange(curr, w) : null,
      lastMonth: curr !== null ? percentChange(curr, m) : null
    };
  }, [today, prevs]);

  const saveToday = async () => {
    if (!userId) return;
    const date = new Date().toISOString().slice(0, 10);
    const payload = { user_id: userId, date, ...form };
    await supabase.from("ssi_history").upsert(payload, { onConflict: "user_id,date" });
    const { data } = await supabase
      .from("ssi_history")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    setEntries((data ?? []) as Snapshot[]);
    setToday((data ?? [])?.find((e: any) => e.date === date) ?? null);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Social Selling Index</h3>
        <div className="text-sm text-ic-subtext">Daily snapshots with growth comparisons</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[
          { label: "Total SSI", key: "total_ssi" },
          { label: "Professional Brand", key: "brand_score" },
          { label: "Locate People", key: "people_score" },
          { label: "Insights", key: "insight_score" },
          { label: "Relationships", key: "relation_score" }
        ].map((f) => (
          <div key={f.key} className="card p-4">
            <p className="text-xs text-ic-subtext">{f.label}</p>
            <p className="text-lg font-semibold">{(today as any)?.[f.key] ?? "-"}</p>
            <input
              type="number"
              className="mt-2 border rounded-md px-2 py-1 w-full"
              value={(form as any)[f.key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: Number(e.target.value) }))}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button className="btn btn-primary" onClick={saveToday}>Save Today</button>
        <div className="text-sm flex items-center gap-2">
          {comparisons.yesterday != null && (
            <span className={comparisons.yesterday >= 0 ? "text-green-600" : "text-red-600"}>
              {comparisons.yesterday >= 0 ? <TrendingUp className="h-4 w-4 inline" /> : <TrendingDown className="h-4 w-4 inline" />} {Math.abs(comparisons.yesterday)}% vs Yesterday
            </span>
          )}
          {comparisons.lastWeek != null && (
            <span className={comparisons.lastWeek >= 0 ? "text-green-600" : "text-red-600"}>
              {comparisons.lastWeek >= 0 ? <TrendingUp className="h-4 w-4 inline" /> : <TrendingDown className="h-4 w-4 inline" />} {Math.abs(comparisons.lastWeek)}% vs Last Week
            </span>
          )}
          {comparisons.lastMonth != null && (
            <span className={comparisons.lastMonth >= 0 ? "text-green-600" : "text-red-600"}>
              {comparisons.lastMonth >= 0 ? <TrendingUp className="h-4 w-4 inline" /> : <TrendingDown className="h-4 w-4 inline" />} {Math.abs(comparisons.lastMonth)}% vs Last Month
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-2">History</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-ic-subtext">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Brand</th>
                <th className="py-2 pr-4">People</th>
                <th className="py-2 pr-4">Insights</th>
                <th className="py-2 pr-4">Relationships</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={`${e.user_id}-${e.date}`} className="border-t border-ic-border">
                  <td className="py-2 pr-4">{e.date}</td>
                  <td className="py-2 pr-4">{e.total_ssi}</td>
                  <td className="py-2 pr-4">{e.brand_score}</td>
                  <td className="py-2 pr-4">{e.people_score}</td>
                  <td className="py-2 pr-4">{e.insight_score}</td>
                  <td className="py-2 pr-4">{e.relation_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 card p-4">
        <p className="text-sm">
          LinkedIn Profile Views and Creator Content Analytics will summarize recent metrics. For more info, go to your LinkedIn Profile.
        </p>
      </div>
    </div>
  );
}

