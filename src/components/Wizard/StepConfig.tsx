"use client";

import React from "react";
import { useWizard, TierType } from "@/context/WizardContext";
import { useLanguage } from "@/context/LanguageContext";

export default function StepConfig() {
    const { state, updateGlobal } = useWizard();
    const { t } = useLanguage();

    const handleRatioChange = (tier: TierType, value: number) => {
        updateGlobal({
            tierRatios: {
                ...state.global.tierRatios,
                [tier]: value,
            },
        });
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold mb-2">{t.advTitle}</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {t.advSubtitle}
                </p>
            </div>

            <div className="glass-card p-6 border-l-4 border-warning">
                <h3 className="text-lg font-semibold mb-2">{t.ratioLabel}</h3>
                <p className="text-sm text-slate-500 mb-6">
                    {t.ratioDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(["hot", "warm", "cold", "frozen"] as TierType[]).map((tier) => (
                        <div key={tier} className={state.global.selectedTiers.includes(tier) ? "opacity-100" : "opacity-40 grayscale pointer-events-none"}>
                            <label className="block text-sm font-medium mb-2 capitalize" htmlFor={`ratio-${tier}`}>
                                {tier} {t.tierRatioSuffix}
                            </label>
                            <div className="relative">
                                <input
                                    id={`ratio-${tier}`}
                                    type="number"
                                    min="1"
                                    className="input-glass w-full text-lg pr-12"
                                    value={state.global.tierRatios[tier]}
                                    onChange={(e) => handleRatioChange(tier, Number(e.target.value))}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                    : 1
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-2">{t.maxShardTitle}</h3>
                <p className="text-sm text-slate-500 mb-6">
                    {t.maxShardDesc}
                </p>
                <div className="flex flex-col max-w-sm">
                    <label className="block text-sm font-medium mb-2" htmlFor="maxShard">
                        {t.sizePerShard}
                    </label>
                    <input
                        id="maxShard"
                        type="number"
                        min="1"
                        className="input-glass w-full text-lg"
                        value={state.global.maxShardSizeGB}
                        onChange={(e) => updateGlobal({ maxShardSizeGB: Number(e.target.value) })}
                    />
                </div>
            </div>
        </div>
    );
}
