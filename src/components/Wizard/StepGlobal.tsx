"use client";

import React from "react";
import { useWizard, TierType } from "@/context/WizardContext";
import { useLanguage } from "@/context/LanguageContext";

export default function StepGlobal() {
    const { state, updateGlobal } = useWizard();
    const { t } = useLanguage();

    const handleTierToggle = (tier: TierType) => {
        const isSelected = state.global.selectedTiers.includes(tier);
        let newTiers;

        if (isSelected) {
            newTiers = state.global.selectedTiers.filter((t) => t !== tier);
        } else {
            newTiers = [...state.global.selectedTiers, tier];
        }
        updateGlobal({ selectedTiers: newTiers });
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold mb-2">{t.globalTitle}</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {t.globalSubtitle}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-card p-6">
                    <label className="block text-sm font-medium mb-2" htmlFor="maxMemory">
                        {t.maxMemoryLabel}
                    </label>
                    <input
                        id="maxMemory"
                        type="number"
                        min="1"
                        className="input-glass w-full"
                        value={state.global.maxMemoryPerNode}
                        onChange={(e) =>
                            updateGlobal({ maxMemoryPerNode: Number(e.target.value) })
                        }
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        {t.maxMemoryDesc}
                    </p>
                </div>

                <div className="glass-card p-6">
                    <label className="block text-sm font-medium mb-2" htmlFor="growthPct">
                        {t.growthLabel}
                    </label>
                    <input
                        id="growthPct"
                        type="number"
                        min="0"
                        className="input-glass w-full"
                        value={state.global.growthPercentage}
                        onChange={(e) =>
                            updateGlobal({ growthPercentage: Number(e.target.value) })
                        }
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        {t.growthDesc}
                    </p>
                </div>
            </div>

            <div className="glass-card p-6 mt-4">
                <h3 className="text-lg font-semibold mb-4">{t.activeTiersLabel}</h3>
                <p className="text-sm text-slate-500 mb-6">
                    {t.activeTiersDesc}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(["hot", "warm", "cold", "frozen"] as TierType[]).map((tier) => (
                        <button
                            key={tier}
                            onClick={() => handleTierToggle(tier)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2
                ${state.global.selectedTiers.includes(tier)
                                    ? "border-primary bg-primary/10 text-primary dark:text-primary-foreground"
                                    : "border-slate-200 dark:border-slate-800 hover:border-primary/50 text-slate-500"
                                }
              `}
                        >
                            <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${state.global.selectedTiers.includes(tier)
                                    ? "bg-primary border-primary"
                                    : "border-slate-400"
                                    }`}
                            >
                                {state.global.selectedTiers.includes(tier) && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                            <span className="capitalize font-medium">{tier}</span>
                        </button>
                    ))}
                </div>
                {state.global.selectedTiers.length === 0 && (
                    <p className="text-danger text-sm mt-4">
                        {t.noTiersConf}
                    </p>
                )}
            </div>
        </div>
    );
}
