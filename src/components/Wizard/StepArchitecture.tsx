"use client";

import React from "react";
import { useWizard } from "@/context/WizardContext";
import { useLanguage } from "@/context/LanguageContext";

export default function StepArchitecture() {
    const { t } = useLanguage();
    const { state, updateArchitecture } = useWizard();

    const handleUpdate = (field: keyof typeof state.architecture, value: number) => {
        updateArchitecture({ [field]: value });
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold mb-2">{t.archTitle}</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {t.archSubtitle}
                </p>
            </div>

            {[
                { title: t.masterNodes, prefix: 'master' },
                { title: t.mlNodes, prefix: 'ml' },
                { title: t.coordNodes, prefix: 'coord' }
            ].map((nodeType) => (
                <div key={nodeType.prefix} className="glass-card p-6 border-l-4 border-l-primary">
                    <h3 className="text-lg font-semibold mb-4">{nodeType.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium mb-2">{t.nodesCount}</label>
                            <input
                                type="number"
                                min="0"
                                className="input-glass w-full text-lg"
                                value={(state.architecture as any)[`${nodeType.prefix}Nodes`]}
                                onChange={(e) => handleUpdate(`${nodeType.prefix}Nodes` as any, Number(e.target.value))}
                            />
                        </div>

                        {/* RAM */}
                        <div>
                            <label className="block text-sm font-medium mb-2">{t.ramSize}</label>
                            <input
                                type="number"
                                min="1"
                                className="input-glass w-full text-lg"
                                value={(state.architecture as any)[`${nodeType.prefix}RamGB`]}
                                onChange={(e) => handleUpdate(`${nodeType.prefix}RamGB` as any, Number(e.target.value))}
                            />
                        </div>

                        {/* Disk */}
                        <div>
                            <label className="block text-sm font-medium mb-2">{t.diskSize}</label>
                            <input
                                type="number"
                                min="0"
                                className="input-glass w-full text-lg"
                                value={(state.architecture as any)[`${nodeType.prefix}DiskGB`]}
                                onChange={(e) => handleUpdate(`${nodeType.prefix}DiskGB` as any, Number(e.target.value))}
                            />
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}
