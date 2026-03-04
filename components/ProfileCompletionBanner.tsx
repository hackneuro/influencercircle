"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getMyProfile } from "@/services/profileService";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileCompletionBanner() {
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function checkProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const profile = await getMyProfile();
        
        if (profile) {
          // Check for essential fields that indicate a complete profile
          // These are the same fields we previously required in the guard
          const hasBasicInfo = profile.name && profile.city && profile.country;
          const hasObjectives = profile.objective && profile.market_objective && profile.location_objective;
          const hasLinkedIn = !!profile.linkedin_url;

          // If any major section is missing, show the banner
          if (!hasBasicInfo || !hasObjectives || !hasLinkedIn) {
            setShowBanner(true);
          }
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setLoading(false);
      }
    }

    checkProfile();
  }, []);

  // Don't show the banner if we are already on the profile page
  if (loading || !showBanner || pathname?.includes("/dashboard/profile")) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-b border-blue-100 p-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-blue-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">Seu perfil está incompleto. Complete-o para aproveitar todos os recursos.</span>
        </div>
        <Link 
          href="/dashboard/profile"
          className="flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900 underline"
        >
          Visit your settings page to update your profile
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
