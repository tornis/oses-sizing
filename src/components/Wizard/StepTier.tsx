"use client";

import React from "react";
import { useWizard, TierType } from "@/context/WizardContext";
import { useLanguage } from "@/context/LanguageContext";

export default function StepTier({ tierName }: { tierName: TierType }) {
    const { t } = useLanguage();
    const { state, updateTier, updateAllTiersVolume } = useWizard();
    const tierData = state.tiers[tierName];

    const handleVolumeChange = (value: number) => {
        // Se for a camada Hot, sincroniza com todas as outras camadas
        if (tierName === "hot") {
            updateAllTiersVolume(value);
        } else {
            updateTier(tierName, { volumePerDayGB: value });
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold mb-2 capitalize">{t.tierTitlePrefix} {tierName} {t.tierTitleSuffix}</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {t.tierSubtitle.replace("{tierName}", tierName)}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="glass-card p-6">
                    <label className="block text-sm font-medium mb-2" htmlFor={`vol-${tierName}`}>
                        {t.volLabel}
                    </label>
                    <input
                        id={`vol-${tierName}`}
                        type="number"
                        min="0"
                        className="input-glass w-full text-lg"
                        value={tierData.volumePerDayGB}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        disabled={tierName !== "hot"}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        {tierName === "hot" ? t.volDesc : t.volDescSynced || "Sincronizado com a camada Hot"}
                    </p>
                </div>

                <div className="glass-card p-6">
                    <label className="block text-sm font-medium mb-2" htmlFor={`ret-${tierName}`}>
                        {t.retentionLabel}
                    </label>
                    <input
                        id={`ret-${tierName}`}
                        type="number"
                        min="1"
                        className="input-glass w-full text-lg"
                        value={tierData.retentionDays}
                        onChange={(e) =>
                            updateTier(tierName, { retentionDays: Number(e.target.value) })
                        }
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        {t.retentionDesc}
                    </p>
                </div>

                <div className="glass-card p-6">
                    <label className="block text-sm font-medium mb-2" htmlFor={`rep-${tierName}`}>
                        {t.replicasLabel}
                    </label>
                    <input
                        id={`rep-${tierName}`}
                        type="number"
                        min="0"
                        className="input-glass w-full text-lg"
                        value={tierData.replicas}
                        onChange={(e) =>
                            updateTier(tierName, { replicas: Number(e.target.value) })
                        }
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        {t.replicasDesc}
                    </p>
                </div>
            </div>
        </div>
    );
}
