"use client";

import React, { useState, useEffect } from "react";
import { useWizard } from "@/context/WizardContext";
import { useLanguage } from "@/context/LanguageContext";
import { User, Mail } from "lucide-react";
import Link from "next/link";

export default function StepUserInfo() {
    const { t } = useLanguage();
    const { state, updateUserInfo } = useWizard();
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // Salvar dados do usuário quando nome e email forem válidos
        const saveUserData = async () => {
            if (state.userInfo.name && state.userInfo.email && validateEmail(state.userInfo.email) && !isSaved) {
                try {
                    const response = await fetch('/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: state.userInfo.name,
                            email: state.userInfo.email,
                        }),
                    });

                    if (response.ok) {
                        setIsSaved(true);
                    }
                } catch (error) {
                    console.error('Error saving user data:', error);
                }
            }
        };

        const timeoutId = setTimeout(saveUserData, 1000);
        return () => clearTimeout(timeoutId);
    }, [state.userInfo.name, state.userInfo.email, isSaved]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isEmailValid = state.userInfo.email === "" || validateEmail(state.userInfo.email);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold mb-2">{t.userInfoTitle}</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {t.userInfoSubtitle}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-card p-6">
                    <label className="block text-sm font-medium mb-2" htmlFor="user-name">
                        {t.nameLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            id="user-name"
                            type="text"
                            className="input-glass w-full text-lg pl-11"
                            placeholder={t.namePlaceholder}
                            value={state.userInfo.name}
                            onChange={(e) => updateUserInfo({ name: e.target.value })}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        {t.nameDesc}
                    </p>
                </div>

                <div className="glass-card p-6">
                    <label className="block text-sm font-medium mb-2" htmlFor="user-email">
                        {t.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            id="user-email"
                            type="email"
                            className={`input-glass w-full text-lg pl-11 ${!isEmailValid ? 'border-red-500 border-2' : ''}`}
                            placeholder={t.emailPlaceholder}
                            value={state.userInfo.email}
                            onChange={(e) => updateUserInfo({ email: e.target.value })}
                        />
                    </div>
                    <p className={`text-xs mt-2 ${!isEmailValid ? 'text-red-500' : 'text-slate-500'}`}>
                        {!isEmailValid ? t.emailInvalid : t.emailDesc}
                    </p>
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="glass-card p-6">
                <div className="flex items-start gap-3">
                    <input
                        id="terms-checkbox"
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                        checked={state.userInfo.termsAccepted}
                        onChange={(e) => updateUserInfo({ termsAccepted: e.target.checked })}
                    />
                    <label htmlFor="terms-checkbox" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                        {t.termsLabel}{" "}
                        <Link 
                            href="/terms" 
                            target="_blank"
                            className="text-primary hover:underline font-medium"
                        >
                            {t.termsLink}
                        </Link>
                        {" "}<span className="text-red-500">*</span>
                    </label>
                </div>
                {!state.userInfo.termsAccepted && state.userInfo.name && state.userInfo.email && (
                    <p className="text-xs text-red-500 mt-2 ml-8">
                        {t.termsRequired}
                    </p>
                )}
            </div>
        </div>
    );
}
