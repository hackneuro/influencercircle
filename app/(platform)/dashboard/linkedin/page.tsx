"use client";
import UnlogLinkedinButton from "@/components/UnlogLinkedinButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useLanguage } from "@/components/marketing/LanguageContext";

function LinkedinDashboardContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  const showEliteSuccess = checkout === "elite-success";
  const [activePopup, setActivePopup] = useState<'create' | 'radar' | null>(null);

  useEffect(() => {
    if (activePopup) {
      const timer = setTimeout(() => setActivePopup(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [activePopup]);

  return (
    <main className="space-y-6">
      {showEliteSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 md:p-5 flex items-start gap-3 shadow-sm">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-semibold">
              {t("dashboard.linkedin.eliteSuccessTitle")}
            </h2>
            <p className="text-xs md:text-sm mt-1">
              {t("dashboard.linkedin.eliteSuccessDesc")}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
             <button 
               onClick={() => setActivePopup('create')}
               className="w-full btn bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold flex-1 text-center"
             >
              {t("dashboard.linkedin.createContent")}
            </button>
            {activePopup === 'create' && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg z-50 text-center shadow-xl animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActivePopup(null); }}
                  className="absolute -top-2 -right-2 bg-white text-slate-900 rounded-full w-5 h-5 flex items-center justify-center font-bold border border-slate-200 shadow-sm hover:bg-slate-100"
                >
                  ×
                </button>
                {t("dashboard.linkedin.comingSoon")}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            )}
        </div>

        <Link href="/dashboard/submit-post" className="btn bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold flex-1 text-center">
          {t("dashboard.submitPost.title")}
        </Link>
        <div className="relative flex-1">
          <button 
            onClick={() => setActivePopup('radar')}
            className="w-full btn bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold"
          >
            {t("dashboard.linkedin.execRadar")}
          </button>
          {activePopup === 'radar' && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg z-50 text-center shadow-xl animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActivePopup(null); }}
                  className="absolute -top-2 -right-2 bg-white text-slate-900 rounded-full w-5 h-5 flex items-center justify-center font-bold border border-slate-200 shadow-sm hover:bg-slate-100"
                >
                  ×
                </button>
                {t("dashboard.linkedin.comingSoon")}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            )}
        </div>
        <div className="flex-1 flex justify-center md:justify-end items-center">
          <UnlogLinkedinButton />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-2">{t("dashboard.linkedin.linkedinDashboardTitle")}</h3>
          <p className="text-sm text-ic-subtext mb-4">
            {t("dashboard.linkedin.linkedinDashboardDesc")}
          </p>
          <a 
            href="https://www.linkedin.com/analytics/profile-views/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary w-full"
          >
            {t("dashboard.linkedin.linkedinDashboardCta")}
          </a>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-2">{t("dashboard.linkedin.ssiTitle")}</h3>
          <p className="text-sm text-ic-subtext mb-4">
            {t("dashboard.linkedin.ssiDesc")}
          </p>
          <a 
            href="https://www.linkedin.com/sales/ssi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary w-full"
          >
            {t("dashboard.linkedin.ssiCta")}
          </a>
        </div>
      </div>
    </main >
  );
}

export default function LinkedinDashboardPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div>{t("dashboard.linkedin.loading")}</div>}>
      <LinkedinDashboardContent />
    </Suspense>
  );
}
