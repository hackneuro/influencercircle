"use client";
import { useLanguage } from "@/components/marketing/LanguageContext";

export default function LanguageSwitcher() {
  const { setLanguage, language } = useLanguage();
  
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setLanguage('en')} 
        className={`text-xl hover:scale-110 transition-transform ${language === 'en' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
        title="English"
      >
        🇺🇸
      </button>
      <button 
        onClick={() => setLanguage('pt-br')} 
        className={`text-xl hover:scale-110 transition-transform ${language === 'pt-br' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
        title="Português"
      >
        🇧🇷
      </button>
      <button 
        onClick={() => setLanguage('es-la')} 
        className={`text-xl hover:scale-110 transition-transform ${language === 'es-la' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
        title="Español"
      >
        🇪🇸
      </button>
    </div>
  );
}
