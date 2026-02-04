import React, { useState } from 'react';
import { Briefcase, Check, ArrowLeft, Building } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function BrandPortal({ onBack }) {
    const { t } = useLanguage();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600 animate-in zoom-in">
                    <Check size={40} />
                </div>
                <h2 className="text-3xl font-bold font-sans mb-4 text-text-main">{t('brandPortal.successTitle')}</h2>
                <p className="text-xl text-text-muted mb-8">
                    {t('brandPortal.successSubtitle')}
                </p>
                <button onClick={onBack} className="btn-secondary">
                    {t('creatorPortal.backBtn')}
                </button>
            </div>
        );
    }

    return (
        <section className="max-w-3xl mx-auto py-12">
            <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-primary mb-8 group transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                {t('creatorPortal.backBtn')}
            </button>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-white p-8 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Building className="text-primary" />
                        <span className="text-sm font-bold text-primary tracking-wider uppercase">{t('brandPortal.forBrands')}</span>
                    </div>
                    <h2 className="text-3xl font-bold font-sans text-text-main">{t('brandPortal.title')}</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-text-main flex items-center gap-2 border-b border-gray-100 pb-2">
                            1. {t('brandPortal.sections.contact')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('creatorPortal.labels.name')}</label>
                                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Jane Smith" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('brandPortal.labels.workEmail')}</label>
                                <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="jane@company.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('creatorPortal.labels.phone')}</label>
                                <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="+1 (555) 000-0000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('brandPortal.labels.website')}</label>
                                <input required type="url" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="https://company.com" />
                            </div>
                        </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-text-main flex items-center gap-2 border-b border-gray-100 pb-2">
                            2. {t('brandPortal.sections.campaign')}
                        </h3>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">{t('brandPortal.labels.objective')}</label>
                            <textarea required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary min-h-[100px]" placeholder={t('brandPortal.placeholders.objective')}></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">{t('brandPortal.labels.persona')}</label>
                            <textarea required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary min-h-[80px]" placeholder={t('brandPortal.placeholders.persona')}></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('brandPortal.labels.size')}</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                                    <option>{t('brandPortal.options.nano')}</option>
                                    <option>{t('brandPortal.options.micro')}</option>
                                    <option>{t('brandPortal.options.mid')}</option>
                                    <option>{t('brandPortal.options.macro')}</option>
                                    <option>{t('brandPortal.options.mega')}</option>
                                    <option>{t('brandPortal.options.authority')}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main">{t('brandPortal.labels.budget')}</label>
                                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="5000" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-4 text-lg shadow-lg hover:shadow-xl transform transition-all"
                    >
                        {t('brandPortal.submitBtn')}
                    </button>
                </form>
            </div>
        </section>
    );
}
