import React from 'react';
import { CheckCircle, XCircle, Zap, Heart, BookOpen, Rocket, Monitor } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Philosophy() {
    const { t } = useLanguage();

    const pillars = [
        { icon: <Heart size={24} />, title: t('philosophy.pillars.positive'), desc: t('philosophy.pillars.positiveDesc') },
        { icon: <Monitor size={24} />, title: t('philosophy.pillars.technical'), desc: t('philosophy.pillars.technicalDesc') },
        { icon: <BookOpen size={24} />, title: t('philosophy.pillars.educational'), desc: t('philosophy.pillars.educationalDesc') },
        { icon: <Zap size={24} />, title: t('philosophy.pillars.motivational'), desc: t('philosophy.pillars.motivationalDesc') },
        { icon: <Rocket size={24} />, title: t('philosophy.pillars.futuristic'), desc: t('philosophy.pillars.futuristicDesc') }
    ];

    return (
        <section className="py-24 bg-surface relative">
            <div className="container mx-auto px-4 text-center">

                <h2 className="text-3xl md:text-5xl font-extrabold font-sans mb-16 text-text-main">
                    {t('philosophy.title').split(' ').map((word, i) => (
                        word.toLowerCase() === 'philosophy' || word.toLowerCase() === 'filosofia' || word.toLowerCase() === 'filosofía'
                            ? <span key={i} className="text-primary"> {word}</span>
                            : <React.Fragment key={i}> {word}</React.Fragment>
                    ))}
                </h2>

                {/* The 5 Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-24">
                    {pillars.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-lg text-text-main">{item.title}</h3>
                            <p className="text-sm text-text-muted">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Guidelines: Accepted vs Not Accepted */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

                    {/* What We Want */}
                    <div className="text-left space-y-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3 text-green-600">
                            <CheckCircle /> {t('philosophy.accepted')}
                        </h3>
                        <div className="bg-green-50/50 rounded-2xl p-8 border border-green-100">
                            <ul className="space-y-4">
                                {pillars.map((p, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        {p.title} Focus
                                    </li>
                                ))}
                                <li className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Professional Networking
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* What We Reject */}
                    <div className="text-left space-y-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3 text-red-600">
                            <XCircle /> {t('philosophy.prohibited')}
                        </h3>
                        <div className="bg-red-50/50 rounded-2xl p-8 border border-red-100">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    {t('philosophy.prohibitedItems.politics')}
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    {t('philosophy.prohibitedItems.religion')}
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    {t('philosophy.prohibitedItems.extremism')}
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    {t('philosophy.prohibitedItems.immoral')}
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    {t('philosophy.prohibitedItems.gambling')}
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
