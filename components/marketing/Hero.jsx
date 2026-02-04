import React, { useState, useEffect } from 'react';
import { CheckCircle, Play } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Hero() {
    const { t } = useLanguage();
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);

    const group1 = [
        { name: "Fernando Dias", role: "CEO & Founder", image: "/fernando.jpeg" },
        { name: "Jonatas Saraiva", role: "CTO & Founder of Obi.tec", image: "/saraiva.jpeg" },
        { name: "Elaine Cavalheiro", role: "COO of PUC angels", image: "/elaine.jpeg" },
        { name: "Marina Witzel", role: "Partner at Camim", image: "/marina.jpeg" }
    ];

    const group2 = [
        { name: "Ulisses Melo", role: "Regional President at PUC angels MG", image: "/ulisses.jpeg" },
        { name: "Diego Feliz", role: "Relationship Manager", image: "/diego.jpeg" },
        { name: "Glades Chuery", role: "Compliance VP", image: "/glades.jpeg" },
        { name: "Patricia Bassan", role: "HR Manager", image: "/patricia.jpeg" }
    ];

    useEffect(() => {
        const timer1 = setInterval(() => {
            setIndex1((prev) => (prev + 1) % group1.length);
        }, 5000);

        const timer2 = setInterval(() => {
            setIndex2((prev) => (prev + 1) % group2.length);
        }, 6500); // Different timing for visual interest

        return () => {
            clearInterval(timer1);
            clearInterval(timer2);
        };
    }, []);

    const currentExec1 = group1[index1];
    const currentExec2 = group2[index2];

    return (
        <section className="min-h-screen flex items-center relative pt-24 pb-12 overflow-hidden bg-white">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <div className="space-y-8 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                        {t('hero.badge')}
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold text-text-main leading-[1.1] tracking-tight whitespace-pre-line">
                        {t('hero.title')}
                    </h1>

                    <p className="text-xl text-text-muted leading-relaxed">
                        {t('hero.subtitle')}
                    </p>

                    <p className="text-lg font-bold text-text-main leading-relaxed">
                        {t('hero.income')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                        <a href="/onboarding" className="btn-primary w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-blue-600/20 text-center">
                            {t('hero.cta')}
                        </a>
                        {/* <div className="text-sm text-text-muted font-medium flex items-center gap-2">
                            <CheckCircle size={18} className="text-tertiary" />
                            <span>Instagram Launch: Feb 2026</span>
                        </div> */}
                    </div>
                </div>

                {/* Right Visual - Simulated "Live Content" Grid */}
                <div className="relative">
                    {/* Decorative Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 via-pink-100 to-green-100 rounded-full blur-3xl opacity-60 -z-10" />

                    <div className="grid grid-cols-2 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
                        {/* Dynamic Carousel Card 1 */}
                        <div className="row-span-2 rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative group transition-all duration-500">
                            <div className="absolute inset-0 transition-opacity duration-1000" key={index1}>
                                <img
                                    src={currentExec1.image}
                                    className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-1000"
                                    alt={currentExec1.name}
                                />
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/50">
                                    <Play fill="white" size={16} className="text-white" />
                                </div>
                                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                                    <p className="font-bold text-sm tracking-tight">Strategic Leadership</p>
                                    <p className="text-xs opacity-90">{currentExec1.name} • {currentExec1.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Carousel Card 2 */}
                        <div className="row-span-2 rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative group transition-all duration-500">
                            <div className="absolute inset-0 transition-opacity duration-1000" key={index2}>
                                <img
                                    src={currentExec2.image}
                                    className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-1000"
                                    alt={currentExec2.name}
                                />
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/50">
                                    <Play fill="white" size={16} className="text-white" />
                                </div>
                                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                                    <p className="font-bold text-sm tracking-tight">Executive Team</p>
                                    <p className="text-xs opacity-90">{currentExec2.name} • {currentExec2.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
