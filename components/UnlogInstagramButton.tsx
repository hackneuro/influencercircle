"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

export default function UnlogInstagramButton() {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeModal = () => setStep(0);

  return (
    <>
      <button 
        onClick={() => setStep(1)}
        className="text-xs text-red-600 hover:text-red-700 hover:underline font-medium transition-colors"
      >
        Unlog your Instagram
      </button>

      {/* Modal 1: First Warning */}
      {step === 1 && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                Are you sure you want to disconnect?
              </h3>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  By disconnecting, you will lose immediate access to the system and the ability to send content. Your Profile will be out of cross-interactions and your engagement will fall 10x.
                </p>
                <p>
                  On top of that, to ensure platform stability and fair usage, we limit reconnections to two instances. Frequent disconnecting may lead to temporary account restrictions or even black list.
                </p>
                <p className="font-semibold text-slate-900">
                  We recommend staying logged in to keep your workflow seamless!
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Never mind, I was just testing
                </button>
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                >
                  Yes, unlog please
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal 2: Final Confirmation */}
      {step === 2 && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                This is a serious step
              </h3>
              <p className="text-slate-500 mb-6">(and we will miss you)</p>
              
              <p className="font-bold text-slate-900 mb-6 text-left">Please confirm:</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={closeModal}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Keep me logged
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="w-full px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  Unlog my Instagram
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal 3: Disconnected */}
      {step === 3 && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Disconnected
              </h3>
              <p className="text-slate-600">
                You are unlogged from the Instagram and our platform.
              </p>
              <button 
                onClick={() => window.location.href = '/'} 
                className="mt-8 w-full px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
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
