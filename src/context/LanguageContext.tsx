"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "../locales/en";
import { pt } from "../locales/pt";
import { es } from "../locales/es";
import { Translations } from "../locales/en";

type Language = "en" | "pt" | "es";

interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translationsMap: Record<Language, Translations> = {
    en,
    pt,
    es,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Inicia com inglês para evitar erro de hidratação SSR
    const [language, setLanguageState] = useState<Language>("en");
    
    // Detecta o idioma do browser apenas no cliente após montagem
    useEffect(() => {
        const browserLang = navigator.language.toLowerCase();
        
        // Verifica se começa com pt (pt-BR, pt-PT, etc)
        if (browserLang.startsWith("pt")) {
            setLanguageState("pt");
        }
        // Verifica se começa com es (es-ES, es-MX, etc)
        else if (browserLang.startsWith("es")) {
            setLanguageState("es");
        }
        // Verifica se começa com en (en-US, en-GB, etc)
        else if (browserLang.startsWith("en")) {
            setLanguageState("en");
        }
        // Default já é "en"
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = translationsMap[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
