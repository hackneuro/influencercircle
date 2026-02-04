"use client";

import { CheckCircle } from "lucide-react";

export default function VerifiedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h1>
        <p className="text-slate-500 mb-8">
          Your email has been successfully verified. You can now close this tab and return to the previous window to continue setting up your profile.
        </p>
        <button 
          onClick={() => window.close()}
          className="text-sm text-slate-400 hover:text-slate-600 underline"
        >
          Close this tab
        </button>
      </div>
    </div>
  );
}
