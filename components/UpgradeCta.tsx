"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types";

export default function UpgradeCta() {
  const [isElite, setIsElite] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const id = userData.user?.id;
        if (!id) {
          setIsElite(false);
          return;
        }
        const { data } = await supabase.from("profiles").select("plan").eq("id", id).maybeSingle();
        setIsElite((data as Profile)?.plan === "elite");
      } catch {
        setIsElite(false);
      }
    })();
  }, []);
  const [showRegions, setShowRegions] = useState(false);

  const regions = [
    { name: "USA", slug: "usa" },
    { name: "PUC angels (Brazil)", slug: "puc-angels" },
    { name: "Brazil", slug: "brazil" },
    { name: "Argentina", slug: "argentina" },
    { name: "Chile", slug: "chile" },
    { name: "Colombia", slug: "colombia" },
    { name: "Mexico", slug: "mexico" },
    { name: "Europe", slug: "europe" },
    { name: "Australia", slug: "australia" },
    { name: "India", slug: "india" },
    { name: "Latin America", slug: "colombia" },
    { name: "Rest of Asia", slug: "usa" },
    { name: "Other", slug: "usa" }
  ];

  if (isElite) return null;

  return (
    <div className="mt-2 space-y-4">
      <button
        onClick={() => setShowRegions(!showRegions)}
        className="btn btn-primary font-bold w-full md:w-auto"
      >
        {showRegions ? "Select your region" : "Upgrade to Elite"}
      </button>

      {showRegions && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
          <label htmlFor="region-select" className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Select your primary market region:
          </label>
          <select
            id="region-select"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium appearance-none shadow-sm"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
            onChange={(e) => {
              if (e.target.value) {
                window.location.href = `/onboarding/elite-pricing?region=${e.target.value}`;
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Browse all regions...</option>
            {regions.map((region) => (
              <option key={region.name} value={region.slug}>
                {region.name}
              </option>
            ))}
          </select>
          <p className="mt-3 text-xs text-slate-400">
            Localized pricing and specialized features will be applied based on your selection.
          </p>
        </div>
      )}
    </div>
  );
}

