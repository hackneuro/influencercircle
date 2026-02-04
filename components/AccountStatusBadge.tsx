"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types";
import { usePathname } from "next/navigation";

type StatusState =
  | { kind: "loading" }
  | { kind: "anonymous" }
  | { kind: "incomplete"; email: string | null }
  | { kind: "member"; email: string | null }
  | { kind: "elite"; email: string | null };

export default function AccountStatusBadge() {
  const [status, setStatus] = useState<StatusState>({ kind: "loading" });
  const pathname = usePathname();

  useEffect(() => {
    let active = true;

    async function checkStatus() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const id = userData.user?.id;
        if (!id) {
          if (!active) return;
          setStatus({ kind: "anonymous" });
          return;
        }

        const { data } = await supabase.from("profiles").select("email, plan").eq("id", id).maybeSingle();
        const profile = data as Pick<Profile, "email" | "plan"> | null;

        if (!active) return;

        const fallbackEmail = userData.user?.email ?? null;

        if (!profile) {
          setStatus({ kind: "incomplete", email: fallbackEmail });
          return;
        }

        if (profile.plan === "elite") {
          setStatus({ kind: "elite", email: profile.email ?? fallbackEmail });
        } else {
          setStatus({ kind: "member", email: profile.email ?? fallbackEmail });
        }
      } catch {
        if (!active) return;
        setStatus({ kind: "anonymous" });
      }
    }

    // Check immediately
    checkStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkStatus();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

  if (status.kind === "loading") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/40 border border-slate-700 text-[11px] text-slate-200">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse" />
        <span>Verificando conta...</span>
      </div>
    );
  }

  if (status.kind === "anonymous") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/40 border border-slate-700 text-[11px] text-slate-200">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
        <span>Não autenticado</span>
      </div>
    );
  }

  if (status.kind === "incomplete") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-400 text-[11px] text-yellow-100 shadow-sm">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
        <span className="font-semibold uppercase tracking-wide">Cadastro Incompleto</span>
        {status.email && <span className="text-[10px] text-yellow-100/80">({status.email})</span>}
      </div>
    );
  }

  if (status.kind === "elite") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400 text-[11px] text-emerald-100 shadow-sm">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold uppercase tracking-wide">Logado · Elite ativo</span>
        {status.email && <span className="text-[10px] text-emerald-100/80">({status.email})</span>}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/40 border border-slate-600 text-[11px] text-slate-100">
      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
      <span className="font-semibold uppercase tracking-wide">Logado · Plano member</span>
      {status.email && <span className="text-[10px] text-slate-300/80">({status.email})</span>}
    </div>
  );
}
