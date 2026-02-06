import React, { useState } from 'react';
import { Shield, Check, X, ArrowLeft, AlertTriangle, Trophy, Camera, Star, TrendingUp, Search, Target, Building2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function CreatorPortal({ onBack }) {
    const { t } = useLanguage();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);

    const targetCategories = [
        {
            icon: <Trophy className="text-blue-500" size={20} />,
            title: t('creatorPortal.categories.executives'),
            desc: t('creatorPortal.categories.executivesDesc')
        },
        {
            icon: <Camera className="text-purple-500" size={20} />,
            title: t('creatorPortal.categories.creators'),
            desc: t('creatorPortal.categories.creatorsDesc')
        },
        {
            icon: <Star className="text-yellow-500" size={20} />,
            title: t('creatorPortal.categories.mentors'),
            desc: t('creatorPortal.categories.mentorsDesc')
        },
        {
            icon: <TrendingUp className="text-green-500" size={20} />,
            title: t('creatorPortal.categories.managers'),
            desc: t('creatorPortal.categories.managersDesc')
        },
        {
            icon: <Search className="text-orange-500" size={20} />,
            title: t('creatorPortal.categories.seekers'),
            desc: t('creatorPortal.categories.seekersDesc')
        },
        {
            icon: <Target className="text-red-500" size={20} />,
            title: t('creatorPortal.categories.sales'),
            desc: t('creatorPortal.categories.salesDesc')
        },
        {
            icon: <Building2 className="text-gray-500" size={20} />,
            title: t('creatorPortal.categories.companies'),
            desc: t('creatorPortal.categories.companiesDesc')
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreedToGuidelines) return; // double check
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-in zoom-in">
                    <Check size={40} />
                </div>
                <h2 className="text-3xl font-bold font-sans mb-4 text-text-main">{t('creatorPortal.successTitle')}</h2>
                <p className="text-xl text-text-muted mb-8">
                    {t('creatorPortal.successSubtitle')}
                </p>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 text-left w-full">
                    <div className="flex gap-3">
                        <AlertTriangle className="shrink-0" size={20} />
                        <div>
                            <strong>Note:</strong> {t('creatorPortal.successNote')}
                        </div>
                    </div>
                </div>
                <button onClick={onBack} className="btn-secondary mt-8">
                    {t('creatorPortal.backBtn')}
                </button>
            </div>
        );
    }

    return (
        <section className="max-w-4xl mx-auto py-12 px-4">
            <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-primary mb-8 group transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                {t('creatorPortal.backBtn')}
            </button>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
                <div className="bg-gradient-to-br from-primary/10 via-background to-white p-8 md:p-12 border-b border-gray-100">
                    <h2 className="text-4xl font-extrabold font-sans mb-6 text-primary">{t('about.cta')}</h2>
                    <p className="text-xl text-text-main leading-relaxed mb-8 font-medium">
                        {t('creatorPortal.intro')}
                    </p>

                    <h3 className="text-lg font-bold text-text-muted uppercase tracking-wider mb-6">{t('creatorPortal.builtFor')}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {targetCategories.map((cat, idx) => (
                            <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                                    {cat.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main mb-1">{cat.title}</h4>
                                    <p className="text-sm text-text-muted leading-relaxed">{cat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-lg font-semibold text-primary leading-relaxed text-center">
                            {t('creatorPortal.ready')}
                        </p>
                    </div>
                </div>

                {/* 
                <div className="p-8 md:p-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
                        {t('creatorPortal.step1')}
                    </div>
                    <h3 className="text-3xl font-bold text-text-main mb-8">{t('creatorPortal.formTitle')}</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('creatorPortal.labels.name')}</label>
                                <input name="Full Name" required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('creatorPortal.labels.email')}</label>
                                <input name="Email" required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('creatorPortal.labels.phone')}</label>
                                <input name="Phone" required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="+1 (555) 000-0000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('creatorPortal.labels.linkedin')}</label>
                                <input name="LinkedIn Profile" required type="url" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="linkedin.com/in/..." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">{t('creatorPortal.labels.instagram')}</label>
                            <input name="Instagram Profile" required type="url" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="instagram.com/..." />
                            <p className="text-xs text-text-muted">{t('creatorPortal.labels.instagramHint')}</p>
                        </div>

                        <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-xl space-y-4">
                            <div className="flex items-start gap-3">
                                <Shield className="text-red-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-red-900 mb-1">{t('creatorPortal.compliance.title')}</h4>
                                    <p className="text-sm text-red-700 leading-relaxed">
                                        {t('creatorPortal.compliance.subtitle')}
                                    </p>
                                </div>
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white/50 transition-colors">
                                <input
                                    type="checkbox"
                                    required
                                    checked={agreedToGuidelines}
                                    onChange={(e) => setAgreedToGuidelines(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                />
                                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                                    {t('creatorPortal.compliance.certify')}
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!agreedToGuidelines}
                            className="w-full btn-primary py-4 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {t('creatorPortal.submitBtn')}
                        </button>

                        <p className="text-center text-xs text-text-muted">
                            {t('creatorPortal.agreeText')}
                        </p>
                    </form>
                </div>
                */}
            </div>
        </section>
    );
}
