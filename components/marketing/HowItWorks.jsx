import React from 'react';
import { useLanguage } from './LanguageContext';

export default function HowItWorks({ onNavigate }) {
    const { t } = useLanguage();

    return (
        <section className="max-w-4xl mx-auto p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl my-12" id="how-it-works">
            <h1 className="text-4xl font-extrabold mb-8 text-primary border-b pb-4">{t('howItWorks.title')}</h1>

            <div className="space-y-12 text-gray-800 leading-relaxed">
                <header className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-4 text-primary">{t('howItWorks.subtitle')}</h2>
                    <p className="text-lg text-gray-600">
                        {t('howItWorks.intro')}
                    </p>
                </header>

                <section>
                    <h3 className="text-2xl font-bold mb-8 text-center text-secondary underline decoration-primary/30 decoration-4 underline-offset-8">{t('howItWorks.processTitle')}</h3>
                    <div className="space-y-12 relative">
                        <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-primary/20 hidden md:block" />

                        <div className="relative pl-0 md:pl-16">
                            <div className="absolute left-0 top-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl z-10 hidden md:flex shadow-lg shadow-primary/20">1</div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                                    <span className="md:hidden bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                    {t('howItWorks.steps.step1')}
                                </h4>
                                <p>{t('howItWorks.steps.step1Desc')}</p>
                                <div className="mt-4 text-sm font-semibold text-primary italic">{t('howItWorks.steps.step1Note')}</div>
                            </div>
                        </div>

                        <div className="relative pl-0 md:pl-16">
                            <div className="absolute left-0 top-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl z-10 hidden md:flex shadow-lg shadow-primary/20">2</div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                                    <span className="md:hidden bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                    {t('howItWorks.steps.step2')}
                                </h4>
                                <p>{t('howItWorks.steps.step2Desc')}</p>

                                <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic">
                                        <p><strong>{t('howItWorks.steps.memberCommon')}:</strong> {t('howItWorks.steps.memberCommonDesc')}</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 italic font-bold text-primary">
                                        <p><strong>{t('howItWorks.steps.memberElite')}:</strong> {t('howItWorks.steps.memberEliteDesc')}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-gray-500 italic">{t('howItWorks.steps.humanized')}</p>
                            </div>
                        </div>

                        <div className="relative pl-0 md:pl-16">
                            <div className="absolute left-0 top-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl z-10 hidden md:flex shadow-lg shadow-primary/20">3</div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                                    <span className="md:hidden bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                    {t('howItWorks.steps.step3')}
                                </h4>
                                <p>{t('howItWorks.steps.step3Desc')}</p>
                            </div>
                        </div>

                        <div className="relative pl-0 md:pl-16">
                            <div className="absolute left-0 top-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl z-10 hidden md:flex shadow-lg shadow-primary/20">4</div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                                    <span className="md:hidden bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                                    {t('howItWorks.steps.step4')}
                                </h4>
                                <p>{t('howItWorks.steps.step4Desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-to-br from-[#1A103C] to-[#2D1B6B] p-10 rounded-3xl text-white shadow-2xl">
                    <h3 className="text-2xl font-orbitron font-bold mb-6 text-center">{t('howItWorks.eliteTitle')}</h3>
                    <p className="text-center mb-8 text-gray-300">{t('howItWorks.eliteSubtitle')}</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <div className="text-blue-400 font-bold text-lg mb-2 italic">{t('howItWorks.eliteItems.multiplier')}</div>
                            <p className="text-sm text-gray-300">{t('howItWorks.eliteItems.multiplierDesc')}</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <div className="text-blue-400 font-bold text-lg mb-2 italic">{t('howItWorks.eliteItems.spotlight')}</div>
                            <p className="text-sm text-gray-300">{t('howItWorks.eliteItems.spotlightDesc')}</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <div className="text-blue-400 font-bold text-lg mb-2 italic">{t('howItWorks.eliteItems.global')}</div>
                            <p className="text-sm text-gray-300">{t('howItWorks.eliteItems.globalDesc')}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-6 text-secondary uppercase tracking-wider">{t('howItWorks.promiseTitle')}</h3>
                    <ul className="grid md:grid-cols-3 gap-4">
                        <li className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm font-bold text-red-900 leading-tight">{t('howItWorks.promiseItems.followers')}</li>
                        <li className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm font-bold text-red-900 leading-tight">{t('howItWorks.promiseItems.farms')}</li>
                        <li className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm font-bold text-red-900 leading-tight">{t('howItWorks.promiseItems.posts')}</li>
                    </ul>
                </section>

                <section className="text-center">
                    <button
                        onClick={() => onNavigate('creator')}
                        className="btn-primary py-4 px-10 text-lg shadow-xl shadow-blue-500/20"
                    >
                        {t('howItWorks.cta')}
                    </button>
                </section>

                <footer className="pt-8 border-t text-center text-sm text-gray-400">
                    <p>Contact: contact@influencercircle.net</p>
                </footer>
            </div>
        </section>
    );
}
