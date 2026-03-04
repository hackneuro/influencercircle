"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function EmailConfirmationBanner() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return null;
    if (user.email_confirmed_at) return null; // Already confirmed
  
    const handleResend = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: user.email!,
        });
        if (error) throw error;
        setSent(true);
      } catch (err: any) {
        setMessage(err.message || "Falha ao reenvidar confirmação.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="bg-yellow-50 border-b border-yellow-100 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">Por favor, confirme seu endereço de e-mail para acessar todos os recursos.</span>
          </div>
          <div className="flex items-center gap-4">
              {message && <span className="text-xs text-red-600">{message}</span>}
              {sent ? (
              <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" /> E-mail enviado!
              </span>
              ) : (
              <button 
                  onClick={handleResend} 
                  disabled={loading}
                  className="text-sm font-medium text-yellow-900 underline hover:text-yellow-700 disabled:opacity-50"
              >
                  {loading ? "Enviando..." : "Reenviar e-mail de confirmação"}
              </button>
              )}
          </div>
        </div>
      </div>
    );
  }
