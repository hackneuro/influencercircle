import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Executives() {
    const { t } = useLanguage();

    const executives = [
        { name: "Fernando Dias", role: "CEO & Founder", link: "https://www.linkedin.com/in/fernandoscdias", image: "/fernando.jpeg", specialized: true, badge: "Founder" },
        { name: "Jonatas Saraiva", role: "CTO & Founder of Obi.tec", link: "https://www.linkedin.com/in/jonatassaraiva/", image: "/saraiva.jpeg", specialized: true, badge: "Founder" },
        { name: "Elaine Cavalheiro", role: "COO of PUC angels", link: "https://www.linkedin.com/in/elainecavalheirolug/", image: "/elaine.jpeg", specialized: true, badge: "COO" },
        { name: "Marina Witzel", role: "Partner at Camim", link: "https://www.linkedin.com/in/marina-taveira-witzel-2b1864137/", image: "/marina.jpeg", specialized: true, badge: "Partner" },
        { name: "Ulisses Melo", role: "Regional President at PUC angels MG", link: "https://www.linkedin.com/in/ulisses-melo/", image: "/ulisses.jpeg", specialized: true, badge: "President" },
        { name: "Diego Feliz", role: "Relationship Manager", link: "https://www.linkedin.com/in/diego-feliz-39487030/", image: "/diego.jpeg", specialized: true, badge: "Manager" },
        { name: "Glades Chuery", role: "Compliance VP", link: "https://www.linkedin.com/in/glades-chuery-inteligencia-artificial-tecnologia-inova%C3%A7%C3%A3o-seguran%C3%A7a-palestrante-mentora-governan%C3%A7a/", image: "/glades.jpeg", specialized: true, badge: "VP" },
        { name: "Patricia Bassan", role: "HR Manager", link: "https://www.linkedin.com/in/patriciabassan/", image: "/patricia.jpeg", specialized: true, badge: "HR" }
    ];

    const companies = [
        { name: "PUC angels", url: "https://www.linkedin.com/company/pucangels", logo: "/pucangels_logo.jpg" },
        { name: "Engage Viral", url: "https://www.linkedin.com/company/engageviralsocial", logo: "/engage_logo.jpg" },
        { name: "HackNeuro", url: "https://www.linkedin.com/company/hackneuro", logo: "/hackneuro_logo.jpg" },
        { name: "Camim Coach", url: "https://www.linkedin.com/company/camim-coach-e-consultoria", logo: "/camim_logo.jpg" },
        { name: "METICA", url: "https://www.linkedin.com/company/meticasaude", logo: "/metica_logo.jpg" },
        { name: "ViralMind", url: "https://www.linkedin.com/company/viralmindsocial", logo: "/viralmind_logo.jpg" },
        { name: "ExMove", url: "https://www.linkedin.com/company/exmove", logo: "/exmove_logo.jpg" }
    ];

    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 z-10 relative">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold font-sans mb-6 text-text-main">
                        {t('executives.title').split(' ').map((word, i) => (
                            word.toLowerCase() === 'elite'
                                ? <span key={i} className="text-primary"> {word}</span>
                                : <React.Fragment key={i}> {word}</React.Fragment>
                        ))}
                    </h2>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        {t('executives.subtitle')}
                    </p>
                </div>

                {/* Executives Grid */}
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-12 justify-center">
                        <div className="h-px w-12 bg-gray-300" />
                        <h3 className="font-bold text-2xl text-text-main tracking-tight uppercase">{t('executives.category')}</h3>
                        <div className="h-px w-12 bg-gray-300" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {executives.map((exec, idx) => (
                            exec.specialized ? (
                                // Specialized Card (Fernando)
                                <a
                                    key={idx}
                                    href={exec.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative overflow-hidden rounded-2xl group h-[350px] flex flex-col justify-end p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/30"
                                >
                                    {/* Background Image */}
                                    <img
                                        src={exec.image}
                                        alt={exec.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A103C] via-transparent to-transparent opacity-90" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    {/* Content */}
                                    <div className="relative z-10 text-left">
                                        <div className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full mb-3">
                                            <p className="text-primary-foreground text-xs font-bold uppercase tracking-wider text-white">{exec.badge || 'Executive'}</p>
                                        </div>
                                        <h4 className="font-bold text-2xl text-white mb-1">{exec.name}</h4>
                                        <p className="text-gray-300 font-medium">{exec.role}</p>

                                        <div className="mt-4 flex items-center gap-2 text-white/90 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                            <span>{t('executives.viewProfile')}</span>
                                            <ExternalLink size={16} />
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                // Standard Card
                                <a
                                    key={idx}
                                    href={exec.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col items-center text-center gap-4 group hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-100 to-indigo-100">
                                            <img
                                                src={exec.image || `https://ui-avatars.com/api/?name=${exec.name}&background=2563eb&color=fff&size=200`}
                                                alt={exec.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-blue-600">
                                            <ExternalLink size={14} />
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-lg text-text-main mb-1">{exec.name}</h4>
                                        <p className="text-primary text-sm font-semibold">{exec.role}</p>
                                        <p className="text-xs text-text-muted mt-2 group-hover:text-primary transition-colors">{t('executives.viewProfile')}</p>
                                    </div>
                                </a>
                            )
                        ))}
                    </div>
                    <div className="text-center mt-12 mb-8">
                        <p className="text-xl text-text-muted italic">{t('executives.andMore')}</p>
                    </div>
                </div>

                {/* Companies Grid */}
                <div className="text-center border-t border-gray-100 pt-16">
                    <h3 className="font-bold text-sm tracking-widest text-text-muted mb-10 uppercase">{t('executives.poweringBrands')}</h3>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                        {companies.map((company, idx) => (
                            <a 
                                key={idx} 
                                href={company.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex flex-col items-center justify-center gap-2 group opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                            >
                                <img 
                                    src={company.logo} 
                                    alt={company.name} 
                                    className="h-16 w-auto object-contain" 
                                />
                                <span className="text-sm font-bold font-sans text-gray-500 group-hover:text-primary transition-colors">{company.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
