import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export default function AboutUs({ onNavigate }) {
    const { t } = useLanguage();

    return (
        <section className="max-w-4xl mx-auto p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl my-12" id="about-us">
            <h1 className="text-4xl font-extrabold mb-8 text-primary border-b pb-4">{t('about.visionTitle')}</h1>

            <div className="space-y-10 text-gray-800 leading-relaxed">
                <header>
                    <h2 className="text-2xl font-bold mb-4 text-primary">{t('about.visionLead')}</h2>
                    <p className="text-lg">
                        {t('about.visionText')}
                    </p>
                </header>

                <section>
                    <h3 className="text-xl font-bold mb-4 text-secondary uppercase tracking-wider">{t('about.visionTitle')}</h3>
                    <p>
                        {t('about.trustItems.authenticityDesc')}
                    </p>
                    <div className="mt-4 p-4 bg-primary/5 border-l-4 border-primary rounded-r-xl">
                        <p className="font-bold text-primary">{t('about.engagementText')}</p>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 text-secondary uppercase tracking-wider">{t('about.howWorksTitle')}</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold mb-2 text-primary">{t('about.sections.interaction')}</h4>
                            <p className="text-sm">{t('about.sections.interactionDesc')}</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold mb-2 text-primary">{t('about.sections.matching')}</h4>
                            <p className="text-sm">{t('about.sections.matchingDesc')}</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold mb-2 text-primary">{t('about.sections.elite')}</h4>
                            <p className="text-sm">{t('about.sections.eliteDesc')}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 text-secondary uppercase tracking-wider">{t('about.trustTitle')}</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">1</div>
                            <div>
                                <h4 className="font-bold text-lg">{t('about.trustItems.safe')}</h4>
                                <p>{t('about.trustItems.safeDesc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">2</div>
                            <div>
                                <h4 className="font-bold text-lg">{t('about.trustItems.authenticity')}</h4>
                                <p>{t('about.trustItems.authenticityDesc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">3</div>
                            <div>
                                <h4 className="font-bold text-lg">{t('about.trustItems.compliance')}</h4>
                                <p>{t('about.trustItems.complianceDesc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 text-secondary uppercase tracking-wider">{t('about.leadershipTitle')}</h3>
                    <p>
                        {t('about.leadershipText')}
                    </p>
                </section>

                <section className="bg-gradient-to-br from-[#1A103C] to-[#2D1B6B] p-10 rounded-3xl text-white text-center shadow-2xl">
                    <h3 className="text-3xl font-orbitron font-bold mb-4">{t('about.cta')}</h3>
                    <p className="mb-8 text-gray-300 max-w-2xl mx-auto">
                        {t('creatorPortal.intro')}
                    </p>
                    <Link
                        href="/app"
                        className="btn-primary py-4 px-10 text-lg shadow-xl shadow-blue-500/20 inline-block"
                    >
                        {t('about.cta')}
                    </Link>
                </section>

                <footer className="pt-8 border-t text-center text-sm text-gray-400">
                    <p>Contact: contact@influencercircle.net</p>
                </footer>
            </div>
        </section>
    );
}
