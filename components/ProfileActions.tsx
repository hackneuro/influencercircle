"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, CheckCircle2 } from "lucide-react";

export default function ProfileActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = (type: string) => {
    setActionType(type);
    setIsOpen(true);
  };

  return (
    <>
      <div className="space-y-3 w-full">
        <button 
          onClick={() => handleAction("Campaign")}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-sm"
        >
          Contact for Campaign
        </button>
        
        <button 
          onClick={() => handleAction("Advisory")}
          className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 text-sm"
        >
          Contact for Advisor
        </button>

        <button 
          onClick={() => handleAction("Recruitment")}
          className="w-full bg-white text-slate-900 border-2 border-slate-200 py-3 px-4 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm"
        >
          Recruit (fixed or Consultancy)
        </button>
      </div>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">Request Sent Successfully!</h3>
              
              <p className="text-gray-600 leading-relaxed mb-2">
                You showed interest in <strong>{actionType}</strong> with this profile.
              </p>
              <p className="text-sm text-gray-500">
                Our team has been notified and will get in touch with you shortly to proceed with the next steps.
              </p>

              <button 
                onClick={() => setIsOpen(false)}
                className="mt-8 w-full bg-slate-900 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
