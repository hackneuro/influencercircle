import React from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useView } from './ViewContext';
import Link from 'next/link';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { currentView, setCurrentView } = useView();

    const onNavigate = (view) => setCurrentView(view);

    const languages = [
        { code: 'pt-br', flag: '🇧🇷', label: 'Português' },
        { code: 'en', flag: '🇺🇸', label: 'English' },
        { code: 'es-la', flag: '🇪🇸', label: 'Español' }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#1A103C] shadow-lg transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Left: Logo */}
                <Link
                    href="/"
                    className="cursor-pointer flex items-center gap-2"
                >
                    <img
                        src="/logo-full.jpg"
                        alt="Influencer Circle"
                        className="h-12 object-contain"
                    />
                </Link>

                {/* Right: Nav Actions + Language Switcher */}
                <div className="flex items-center gap-6 md:gap-8">
                    {/* Desktop Nav Actions */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => onNavigate('aboutus')}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                {t('header.about')}
                            </button>
                            <button
                                onClick={() => onNavigate('howitworks')}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                {t('header.how')}
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-white hover:text-blue-400 font-medium text-sm transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/app"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all shadow-lg shadow-blue-500/20"
                            >
                                PLATFORM / APP
                            </Link>
                            <Link
                                href="/app"
                                className="btn-primary py-2.5 px-6 text-sm shadow-lg shadow-blue-500/20"
                            >
                                {t('header.joinCreator')}
                            </Link>
                        </div>
                    </div>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 border-l border-white/10 pl-6 md:pl-8">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                title={lang.label}
                                className={`text-2xl transition-all duration-300 hover:scale-125 ${language === lang.code ? 'scale-110 opacity-100' : 'opacity-50 hover:opacity-100'}`}
                            >
                                {lang.flag}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white hover:text-primary"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-[#1A103C] border-t border-gray-800 p-6 flex flex-col gap-6 md:hidden shadow-xl animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => { onNavigate('aboutus'); setIsMenuOpen(false); }}
                                className="text-left font-medium text-gray-200 hover:text-white"
                            >
                                {t('header.about')}
                            </button>
                            <button
                                onClick={() => { onNavigate('howitworks'); setIsMenuOpen(false); }}
                                className="text-left font-medium text-gray-200 hover:text-white"
                            >
                                {t('header.how')}
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-center font-medium text-white hover:text-blue-400 py-2"
                            >
                                Login
                            </Link>
                            <Link
                                href="/app"
                                onClick={() => setIsMenuOpen(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full text-sm text-center transition-all"
                            >
                                PLATFORM / APP
                            </Link>
                            <Link
                                href="/app"
                                onClick={() => setIsMenuOpen(false)}
                                className="btn-primary w-full text-center"
                            >
                                {t('header.joinCreator')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
