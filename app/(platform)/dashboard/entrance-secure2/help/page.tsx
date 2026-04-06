"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Phone, HelpCircle, ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Language = 'en' | 'pt' | 'es';

export default function LoginHelpPage() {
  const [userName, setUserName] = useState("there");
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('en');

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

    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pt') setLang('pt');
    else if (browserLang === 'es') setLang('es');
    else setLang('en');
  }, []);

  const content = {
    en: {
      title: "Need help?",
      greeting: "Don't worry",
      mainText: "we got you covered, our team in Brazil (Isabela Torres - +5511 99789-6773 will contact you and sort it out).",
      subText: "She will arrange a special and unique session so you can log in with assistance",
      contactInfo: "You will be contacted by: Isabela Torres - she is not AI, so please be gentle and patient",
      backBtn: "Back to Dashboard"
    },
    pt: {
      title: "Precisa de ajuda?",
      greeting: "Não se preocupe",
      mainText: "estamos aqui para ajudar, nossa equipe no Brasil (Isabela Torres - +5511 99789-6773 entrará em contato para resolver tudo).",
      subText: "Ela agendará uma sessão especial e única para que você possa fazer o login com assistência",
      contactInfo: "Você será contatado por: Isabela Torres - ela não é IA, então por favor seja gentil e paciente",
      backBtn: "Voltar para o Painel"
    },
    es: {
      title: "¿Necesitas ayuda?",
      greeting: "No te preocupes",
      mainText: "te tenemos cubierto, nuestro equipo en Brasil (Isabela Torres - +5511 99789-6773 se pondrá en contacto contigo para solucionarlo).",
      subText: "Ella organizará una sesión especial y única para que puedas iniciar sesión con asistencia",
      contactInfo: "Serás contactado por: Isabela Torres - ella no es IA, así que por favor sé amable y paciente",
      backBtn: "Volver al Panel"
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const t = content[lang];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="mb-6 flex gap-2">
        {(['en', 'pt', 'es'] as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              lang === l ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-blue-50 overflow-hidden shadow-xl">
              {/* Note: User needs to upload the image to /public/isabela.jpg */}
              <Image 
                src="/isabela.jpg" 
                alt="Isabela Torres" 
                width={96} 
                height={96}
                className="object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist yet
                  e.currentTarget.src = "https://www.influencercircle.net/isabela.jpg";
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
        </div>

        <div className="space-y-6 text-slate-700">
          <div className="text-lg leading-relaxed">
            {t.greeting} <strong className="text-blue-600 uppercase">{userName}</strong>, {t.mainText}
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
             <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-sm shrink-0">
               <Phone className="h-5 w-5" />
             </div>
             <p className="text-sm text-blue-800 font-medium leading-snug">
               {t.subText}
             </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 italic text-sm text-slate-600 leading-relaxed">
            {t.contactInfo}
          </div>

          <Link 
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-4 text-slate-400 hover:text-blue-600 transition-all font-bold text-sm mt-4 border-t border-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
