"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('language');
            return saved || 'pt-br';
        }
        return 'pt-br';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', language);
        }
    }, [language]);

    const t = (key: string) => {
        const keys = key.split('.');
        let value: any = (translations as any)[language];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // return the key itself if not found
            }
        }
        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
