import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Heart, Cpu, BookOpen, Zap, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Footer({ onNavigate }) {
    const { t } = useLanguage();

    const pillars = [
        { icon: <Heart size={20} />, title: t('philosophy.pillars.positive'), desc: t('philosophy.pillars.positiveDescShort') },
        { icon: <Cpu size={20} />, title: t('philosophy.pillars.technical'), desc: t('philosophy.pillars.technicalDescShort') },
        { icon: <BookOpen size={20} />, title: t('philosophy.pillars.educational'), desc: t('philosophy.pillars.educationalDescShort') },
        { icon: <Zap size={20} />, title: t('philosophy.pillars.motivational'), desc: t('philosophy.pillars.motivationalDescShort') },
        { icon: <Globe size={20} />, title: t('philosophy.pillars.futuristic'), desc: t('philosophy.pillars.futuristicDescShort') },
    ];

    return (
        <footer className="border-t border-white/10 bg-black/50 pt-20 pb-10" id="code-of-conduct">
            <div className="container mx-auto px-4">

                {/* Philosophy Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-orbitron font-bold mb-4">{t('footer.conduct')}</h2>
                        <p className="text-gray-400">{t('footer.pillarsSubtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {pillars.map((pillar, idx) => (
                            <div key={idx} className="glass-card p-6 flex flex-col items-center text-center gap-4 hover:bg-white/5 transition-colors group">
                                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    {pillar.icon}
                                </div>
                                <div>
                                    <h3 className="font-orbitron font-bold text-lg mb-1">{pillar.title}</h3>
                                    <p className="text-sm text-gray-400">{pillar.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/10 my-10" />

                {/* Links & Copy */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                    <div className="flex flex-col gap-2">
                        <span className="font-orbitron font-bold text-xl text-white">Influencer Circle . net</span>
                        <p className="text-sm text-gray-500 max-w-md">
                            {t('footer.tagline')}
                            <br />
                            {t('footer.restriction')}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                        <button onClick={() => onNavigate('privacypolicy')} className="hover:text-primary transition-colors">{t('footer.links.privacy')}</button>
                        <button onClick={() => onNavigate('termsofservice')} className="hover:text-primary transition-colors">{t('footer.links.terms')}</button>
                        <button onClick={() => onNavigate('creatorterms')} className="hover:text-primary transition-colors">{t('footer.links.creatorTerms')}</button>
                        <button onClick={() => onNavigate('codeofconduct')} className="hover:text-primary transition-colors">{t('footer.links.conduct')}</button>
                    </div>

                    <div className="flex gap-4">
                        <a href="https://www.linkedin.com/company/influencer-circle-global" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all" title="Follow us on LinkedIn">
                            <Linkedin size={18} />
                        </a>
                        {/* <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-all">
                            <Instagram size={18} />
                        </a> */}
                    </div>
                </div>

                <div className="text-center mt-12 text-xs text-gray-600">
                    © {new Date().getFullYear()} Influencer Circle  {t('footer.rights')}
                    <div className="mt-2">
                        Powered by <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Stripe</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
