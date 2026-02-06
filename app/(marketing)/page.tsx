"use client";

import React from 'react';
import CodeOfConduct from '@/components/marketing/CodeOfConduct';
import TermsOfService from '@/components/marketing/TermsOfService';
import PrivacyPolicy from '@/components/marketing/PrivacyPolicy';
import CreatorTerms from '@/components/marketing/CreatorTerms';
import AboutUs from '@/components/marketing/AboutUs';
import HowItWorks from '@/components/marketing/HowItWorks';
import Hero from '@/components/marketing/Hero';
import CreatorPortal from '@/components/marketing/CreatorPortal';
import BrandPortal from '@/components/marketing/BrandPortal';
import Executives from '@/components/marketing/Executives';
import Philosophy from '@/components/marketing/Philosophy';
import { useView } from '@/components/marketing/ViewContext';

export default function MarketingPage() {
    const { currentView, setCurrentView } = useView();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentView]);

    const renderContent = () => {
        switch (currentView) {
            case 'creator':
                return <CreatorPortal onBack={() => setCurrentView('landing')} />;
            case 'brand':
                return <BrandPortal onBack={() => setCurrentView('landing')} />;
            case 'codeofconduct':
                return <CodeOfConduct />;
            case 'termsofservice':
                return <TermsOfService />;
            case 'privacypolicy':
                return <PrivacyPolicy />;
            case 'creatorterms':
                return <CreatorTerms />;
            case 'aboutus':
                return <AboutUs onNavigate={setCurrentView} />;
            case 'howitworks':
                return <HowItWorks onNavigate={setCurrentView} />;
            case 'landing':
            default:
                return (
                    <>
                        <Hero />
                        <Philosophy />
                        {/* <Executives /> */}
                    </>
                );
        }
    };

    return (
        <div className="space-y-10">
            {renderContent()}
        </div>
    );
}
