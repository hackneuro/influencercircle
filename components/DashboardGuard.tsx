"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/services/profileService";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    // Only set up inactivity listeners if authorized
    if (!authorized) return;

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    
    // Initial timer set
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [authorized, resetTimer]);

  useEffect(() => {
    async function checkProfile() {
      try {
        const profile = await getMyProfile();
        
        if (!profile) {
          // No profile or not logged in
          router.push("/onboarding");
          return;
        }

        // Check for essential fields that indicate onboarding completion
        const hasBasicInfo = !!profile.name; // Relaxed check: name is enough for basic profile existence
        
        // We consider onboarding successful if we have a name.
        // The user can complete other details later in the profile section.
        if (hasBasicInfo) {
          setAuthorized(true);
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("DashboardGuard error:", error);
        router.push("/onboarding");
      } finally {
        setLoading(false);
      }
    }

    checkProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-slate-500 text-sm">Checking access...</p>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
