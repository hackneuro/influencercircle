"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function EntranceSecure2Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    }
    checkUser();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setUpdating(true);
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      toast.success("Password changed successfully!");

      // Force a small delay to ensure DB/Metadata consistency
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Strategy 0: Check the user's metadata directly (most reliable if set)
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      const metaToken = updatedUser?.user_metadata?.connect_link_token;
      
      if (metaToken) {
        console.log("Found token in user metadata, redirecting to unique link:", metaToken);
        window.location.href = `/l/${metaToken}`;
        return;
      }

      const emailFilter = user.email?.toLowerCase();
      const idFilter = user.id;

      console.log("Searching for application with:", { email: emailFilter, id: idFilter });

      // Search 1: Try by user_id first (most accurate)
      const { data: appById, error: errById } = await supabase
        .from("applications")
        .select("connect_link_token, id, email")
        .eq("user_id", idFilter)
        .not("connect_link_token", "is", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (appById && appById.length > 0 && appById[0].connect_link_token) {
        const token = appById[0].connect_link_token;
        console.log("Found token by user_id, redirecting to unique link:", token);
        window.location.href = `/l/${token}`;
        return;
      }

      // Search 2: Try by email (case-insensitive search if possible, or multiple variants)
      const { data: appByEmail, error: errByEmail } = await supabase
        .from("applications")
        .select("connect_link_token, id, email")
        .or(`email.ilike.${emailFilter},email.eq.${user.email}`)
        .not("connect_link_token", "is", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (appByEmail && appByEmail.length > 0 && appByEmail[0].connect_link_token) {
        const token = appByEmail[0].connect_link_token;
        console.log("Found token by email, redirecting to unique link:", token);
        window.location.href = `/l/${token}`;
        return;
      }

      // Search 3: Final attempt - just get ANY application for this user and try to find a token in storage
      const { data: anyApp } = await supabase
        .from("applications")
        .select("id, connect_link_token")
        .or(`email.eq.${user.email},user_id.eq.${idFilter}`)
        .order("created_at", { ascending: false })
        .limit(1);

      if (anyApp && anyApp.length > 0) {
        if (anyApp[0].connect_link_token) {
           window.location.href = `/l/${anyApp[0].connect_link_token}`;
           return;
        }
        
        // If we found the app but no token in DB, maybe it's in storage?
        // Let's try to fetch from the API that handles link tokens
        try {
          const res = await fetch(`/api/public/connect-link-status?email=${encodeURIComponent(user.email)}`);
          const data = await res.json();
          if (data?.token) {
            window.location.href = `/l/${data.token}`;
            return;
          }
        } catch (e) {}
      }

      // If we reach here, we REALLY couldn't find the link.
      console.error("COULD NOT FIND SECURE LINK FOR USER:", user.email);
      toast.error("Password changed, but we couldn't find your unique secure link. Please contact support.");
      
      // Instead of dashboard, let's stay here and show a helpful message
      // but the user might be stuck, so we provide a link to the dashboard as a last resort
      setTimeout(() => {
        router.push("/dashboard");
      }, 5000);

    } catch (error: any) {
      console.error("Password change or redirect error:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Secure Your Account</h1>
          <p className="text-slate-500 mt-2">
            In order to keep your account secure please change your password:
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 chars)"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {updating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                Confirm and move to Linkedin Login
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            This extra security step ensures only you have access to your account. 
            After changing your password, you will be redirected to verify your information 
            and complete the LinkedIn login process.
          </p>
        </div>
      </div>
    </div>
  );
}
