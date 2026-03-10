"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function PasswordChangeBanner() {
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function check() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const shouldChange = !!user?.user_metadata?.force_password_change;
        setShowBanner(shouldChange);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, []);

  if (loading || !showBanner || pathname?.includes("/dashboard/profile")) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-100 p-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-amber-900">
          <Lock className="h-5 w-5 shrink-0 text-amber-700" />
          <span className="text-sm font-medium">
            Please change your password to a definitive one.
          </span>
        </div>
        <Link
          href="/dashboard/profile#password"
          className="btn btn-outline text-sm flex items-center gap-2 border-amber-200 bg-white hover:bg-amber-50"
        >
          Change Password <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

