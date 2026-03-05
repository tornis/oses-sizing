"use client";

import React, { useMemo, useRef } from "react";
import { useWizard } from "@/context/WizardContext";
import { useLanguage } from "@/context/LanguageContext";
import { calculateClusterSizing } from "@/utils/calculations";
import { Server, Database, MemoryStick, HardDrive, Download, Network } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function StepDashboard() {
    const { state } = useWizard();
    const { t } = useLanguage();
    const reportRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        // Serializa o estado e abre a página de impressão
        const stateJson = encodeURIComponent(JSON.stringify(state));
        window.open(`/print?state=${stateJson}`, '_blank');
    };

    const handleViewArchitecture = () => {
        // Serializa o estado e abre a página de arquitetura
        const stateJson = encodeURIComponent(JSON.stringify(state));
        window.open(`/architecture?state=${stateJson}`, '_blank');
    };

    const handleExportPDF = async () => {
        if (!reportRef.current) return;

        const canvas = await html2canvas(reportRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            onclone: (clonedDoc) => {
                // Fix for Tailwind 4 / html2canvas color parsing bug
                // html2canvas fails on modern lab() or oklch() colors.
                // We inject a style block to the clone to force standard colors.
                const style = clonedDoc.createElement("style");
                style.innerHTML = `
                  * { 
                    backdrop-filter: none !important; 
                    -webkit-backdrop-filter: none !important;
                    background-image: none !important;
                  }
                  :root {
                    --color-primary: #3b82f6 !important;
                    --primary: #3b82f6 !important;
                    --background: #ffffff !important;
                    --foreground: #0f172a !important;
                  }
                  .bg-gradient-to-r,
                  .bg-gradient-premium,
                  [class*="bg-gradient"] {
                    background: #ffffff !important;
                    background-image: none !important;
                  }
                `;
                clonedDoc.head.appendChild(style);

                const elements = clonedDoc.getElementsByTagName("*");
                for (let i = 0; i <elements.length; i++) {
                    const el = elements[i] as HTMLElement;
                    if (el.style) {
                        // Use setProperty to avoid TS lint errors for vendor prefixes and forced styles
                        el.style.setProperty("backdrop-filter", "none", "important");
                        el.style.setProperty("-webkit-backdrop-filter", "none", "important");
                        el.style.setProperty("background-image", "none", "important");
                    }
                }
            }
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width / 2, canvas.height / 2]
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save(`Elasticsearch_Sizing_Report.pdf`);
    };

    // Recalculate anytime the user reaches this step
    const sizing = useMemo(() => calculateClusterSizing(state), [state]);

    return (
        <div ref={reportRef} className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4">
            <div>
                <h2 className="text-3xl font-bold text-primary mb-2">
                    {t.dashTitle}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {t.dashSubtitle}
                </p>
            </div>

            {/* Top Level Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        <Database size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-slate-600 dark:text-slate-300">
                        <HardDrive size={20} className="text-primary" />
                        <h3 className="font-semibold text-lg">{t.totalStorage}</h3>
                    </div>
                    <div className="text-4xl font-bold">
                        {sizing.totals.storageTB} <span className="text-lg font-medium text-slate-500">TB</span>
                    </div>
                    <div className="text-sm mt-1 text-slate-500 flex items-center gap-2">
                        <span>{sizing.totals.storageGB.toLocaleString('en-US', { maximumFractionDigits: 1 })} GB</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>{sizing.totals.shards} {t.totalShards}</span>
                    </div>
                </div>

                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        <MemoryStick size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-slate-600 dark:text-slate-300">
                        <MemoryStick size={20} className="text-primary" />
                        <h3 className="font-semibold text-lg">{t.totalMemory}</h3>
                    </div>
                    <div className="text-4xl font-bold">
                        {sizing.totals.memoryGB.toLocaleString()} <span className="text-lg font-medium text-slate-500">GB</span>
                    </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-primary relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        <Server size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-slate-600 dark:text-slate-300">
                        <Server size={20} className="text-primary" />
                        <h3 className="font-semibold text-lg">{t.totalNodes}</h3>
                    </div>
                    <div className="text-4xl font-bold">
                        {sizing.totals.nodes} <span className="text-lg font-medium text-slate-500">{t.instances}</span>
                    </div>
                </div>
            </div>

            {/* Tier Details - Full Width */}
            <div className="glass-card p-6 mt-4">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Database size={18} className="text-primary" />
                    {t.dataTiersProv}
                </h3>
                <div className="space-y-4">
                    {sizing.tiers.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">{t.noTiersConf}</p>
                    ) : (
                        sizing.tiers.filter((tier) => {
                            // Ocultar camada se houver valores inválidos
                            return tier.totalNodes > 0 && 
                                   !isNaN(tier.totalStorageGB) && 
                                   !isNaN(tier.totalMemoryGB) && 
                                   tier.totalStorageGB > 0;
                        }).map((tier) => {
                            const tierConfig = state.tiers[tier.tierName as keyof typeof state.tiers];
                            const tierColors = {
                                hot: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900',
                                warm: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
                                cold: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
                                frozen: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900'
                            };
                            const tierIconColors = {
                                hot: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
                                warm: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
                                cold: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                                frozen: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            };
                            
                            return (
                                <div key={tier.tierName} className={`p-5 rounded-lg border ${tierColors[tier.tierName as keyof typeof tierColors]}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold uppercase text-sm ${tierIconColors[tier.tierName as keyof typeof tierIconColors]}`}>
                                                {tier.tierName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold capitalize text-lg">
                                                    {tier.tierName === 'hot' ? t.hotTier : 
                                                     tier.tierName === 'warm' ? t.warmTier : 
                                                     tier.tierName === 'cold' ? t.coldTier : 
                                                     tier.tierName === 'frozen' ? t.frozenTier : tier.tierName} {t.nodeSuffix}
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">{tier.totalNodes} {tier.totalNodes > 1 ? t.nodesSuffix : t.nodeSuffix}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl">
                                                {tier.totalStorageGB >= 1000 
                                                    ? `${(tier.totalStorageGB / 1000).toFixed(2)} TB`
                                                    : `${tier.totalStorageGB.toFixed(2)} GB`
                                                }
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-end gap-2">
                                                <span>{Math.round(tier.totalMemoryGB)} GB {t.ramSuffix}</span>
                                                <span>•</span>
                                                <span>{tier.totalShards} Shards</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Configurações e Cálculos */}
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="text-xs">
                                                <span className="text-slate-500 dark:text-slate-400">{t.volumePerDay}:</span>
                                                <span className="ml-1 font-semibold">{tierConfig.volumePerDayGB} GB</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-slate-500 dark:text-slate-400">{t.retention}:</span>
                                                <span className="ml-1 font-semibold">{tierConfig.retentionDays} dias</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-slate-500 dark:text-slate-400">{t.replicas}:</span>
                                                <span className="ml-1 font-semibold">{tierConfig.replicas}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="text-xs">
                                                <span className="text-slate-500 dark:text-slate-400">{t.growth}:</span>
                                                <span className="ml-1 font-semibold">{state.global.growthPercentage}%</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-slate-500 dark:text-slate-400">{t.ramPerNode}:</span>
                                                <span className="ml-1 font-semibold">{state.global.maxMemoryPerNode} GB</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-slate-500 dark:text-slate-400">{t.ratio}:</span>
                                                <span className="ml-1 font-semibold">{state.global.tierRatios[tier.tierName as keyof typeof state.global.tierRatios]}:1</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Fórmula Aplicada */}
                                    <div className="mt-3 p-3 bg-white/50 dark:bg-slate-900/30 rounded text-xs font-mono">
                                        <div className="text-slate-600 dark:text-slate-400">
                                            Storage = {tierConfig.volumePerDayGB} × {tierConfig.retentionDays} × {tierConfig.replicas + 1} × 1.25 × {(1 + state.global.growthPercentage / 100).toFixed(2)} = <span className="font-bold text-slate-900 dark:text-white">{tier.totalStorageGB.toFixed(2)} GB</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Dedicated Roles - Full Width Below */}
            <div className="glass-card p-6 mt-4">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Server size={18} className="text-primary" />
                    {t.dedicatedRoles}
                </h3>
                <div className="space-y-4">
                    {[
                        { label: t.masterNodes, data: sizing.master, icon: 'M', color: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900', iconColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
                        { label: t.mlNodes, data: sizing.ml, icon: 'ML', color: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900', iconColor: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
                        { label: t.coordNodes, data: sizing.coord, icon: 'C', color: 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900', iconColor: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
                    ].filter((role) => {
                        // Ocultar role se houver valores inválidos
                        return role.data.nodes > 0 && 
                               !isNaN(role.data.storageGB) && 
                               !isNaN(role.data.memoryGB);
                    }).map((role) => (
                        <div key={role.label} className={`p-5 rounded-lg border ${role.color}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${role.iconColor}`}>
                                        {role.icon}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{role.label}</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">{role.data.nodes} {role.data.nodes !== 1 ? t.instances : t.nodeSuffix}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-xl">{role.data.storageGB} GB</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">{role.data.memoryGB} GB {t.ramSuffix}</div>
                                </div>
                            </div>
                            
                            {/* Configurações */}
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-xs">
                                        <span className="text-slate-500 dark:text-slate-400">{t.diskPerNode}:</span>
                                        <span className="ml-1 font-semibold">{role.data.storageGB / role.data.nodes} GB</span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-slate-500 dark:text-slate-400">{t.ramPerNode}:</span>
                                        <span className="ml-1 font-semibold">{role.data.memoryGB / role.data.nodes} GB</span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-slate-500 dark:text-slate-400">{t.totalNodesLabel}:</span>
                                        <span className="ml-1 font-semibold">{role.data.nodes}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
