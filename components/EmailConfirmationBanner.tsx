"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { AlertTriangle, CheckCircle, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export default function EmailConfirmationBanner() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function checkStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setCheckingStatus(false);
          return;
        }
        setUser(user);

        // Check custom verification status
        const { data: profile } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', user.id)
          .single();
        
        if (profile?.email_verified) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      } finally {
        setCheckingStatus(false);
      }
    }
    
    checkStatus();
  }, []);

  if (checkingStatus || !user || isVerified) return null;

  // Don't show banner on onboarding pages
  if (pathname?.startsWith("/onboarding") || pathname?.startsWith("/apply")) return null;

  const handleSendCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to send code');
      
      setCodeSent(true);
      toast.success("Código de verificação enviado para seu e-mail!");
    } catch (err: any) {
      toast.error(err.message || "Falha ao enviar código.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Por favor, digite o código de 6 dígitos.");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email,
          code: verificationCode 
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Invalid code');

      setIsVerified(true);
      toast.success("E-mail verificado com sucesso!");
      
      // Update local storage or trigger a refresh if needed
      // window.location.reload(); // Optional: reload to update UI state elsewhere
    } catch (err: any) {
      toast.error(err.message || "Código inválido ou expirado.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-amber-900">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
          <div className="flex flex-col">
            <span className="font-semibold">Verifique seu e-mail</span>
            <span className="text-sm text-amber-800">
              Para acessar todos os recursos e garantir a segurança da sua conta, por favor confirme seu endereço de e-mail.
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {!codeSent ? (
            <button 
              onClick={handleSendCode} 
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" /> Enviar código de verificação
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Código de 6 dígitos"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full sm:w-32 px-3 py-2 border border-amber-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleVerifyCode}
                  disabled={verifying || verificationCode.length !== 6}
                  className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verificar"
                  )}
                </button>
                <button
                  onClick={() => setCodeSent(false)}
                  className="px-3 py-2 text-amber-700 hover:text-amber-900 text-sm font-medium underline"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
