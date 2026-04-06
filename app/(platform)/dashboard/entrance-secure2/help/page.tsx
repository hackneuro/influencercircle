"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Phone, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginHelpPage() {
  const [userName, setUserName] = useState("there");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) {
        const firstName = user.user_metadata.name.split(' ')[0];
        setUserName(firstName);
      }
      setLoading(false);
    }
    getUser();
  }, []);

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 text-blue-600">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Need help?</h1>
        </div>

        <div className="space-y-6 text-slate-700">
          <p className="text-lg leading-relaxed">
            Don&apos;t worry <strong className="text-blue-600 uppercase">{userName}</strong>, we got you cover, our team in Brazil (Isabela Torres - <a href="tel:+5511997896773" className="font-bold text-blue-600 hover:underline">+5511 99789-6773</a> will contact you and sort it out).
          </p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
             <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm shrink-0">
               <Phone className="h-5 w-5" />
             </div>
             <p className="text-sm text-blue-800 font-medium">
               She will arrange a special and unique section so you can log in with assistance
             </p>
          </div>

          <Link 
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 text-slate-500 hover:text-slate-800 transition-all font-medium text-sm mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
