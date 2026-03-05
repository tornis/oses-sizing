"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
            <Globe size={16} className="text-slate-500" />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "pt" | "es")}
                className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none pr-4"
                style={{ backgroundImage: 'none' }}
            >
                <option value="en">EN</option>
                <option value="pt">PT-BR</option>
                <option value="es">ES</option>
            </select>
        </div>
    );
}
