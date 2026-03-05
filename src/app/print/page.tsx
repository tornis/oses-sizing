"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { WizardState } from "@/context/WizardContext";
import { calculateClusterSizing } from "@/utils/calculations";
import { Server, Database, MemoryStick, HardDrive } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function PrintPage() {
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    
    useEffect(() => {
        // Aguarda um pequeno delay para garantir que a página renderizou completamente
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

    // Recupera o estado do sessionStorage
    const stateJson = searchParams.get("state");
    if (!stateJson) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-slate-500">{t.noDataFound || "No sizing data found."}</p>
            </div>
        );
    }

    let state: WizardState;
    try {
        state = JSON.parse(decodeURIComponent(stateJson));
    } catch (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-slate-500">{t.errorLoadingData || "Error loading sizing data."}</p>
            </div>
        );
    }

    const sizing = calculateClusterSizing(state);

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b-2 border-[#F9A825] pb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-[#1B2A4E] mb-2">
                            {t.dashTitle}
                        </h1>
                        <p className="text-slate-600">
                            {t.dashSubtitle}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Image 
                            src="/logo_tornis.png" 
                            alt="Tornis Tecnologia" 
                            width={120} 
                            height={60}
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Top Level Summary Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="border border-slate-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2 text-slate-600">
                            <HardDrive size={20} className="text-primary" />
                            <h3 className="font-semibold text-lg">{t.totalStorage}</h3>
                        </div>
                        <div className="text-4xl font-bold">
                            {sizing.totals.storageTB} <span className="text-lg font-medium text-slate-500">TB</span>
                        </div>
                        <div className="text-sm mt-1 text-slate-500 flex items-center gap-2">
                            <span>{sizing.totals.storageGB.toLocaleString('en-US', { maximumFractionDigits: 1 })} GB</span>
                            <span className="text-slate-300">•</span>
                            <span>{sizing.totals.shards} {t.totalShards}</span>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2 text-slate-600">
                            <MemoryStick size={20} className="text-primary" />
                            <h3 className="font-semibold text-lg">{t.totalMemory}</h3>
                        </div>
                        <div className="text-4xl font-bold">
                            {sizing.totals.memoryGB.toLocaleString()} <span className="text-lg font-medium text-slate-500">GB</span>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-6 border-l-4 border-l-primary">
                        <div className="flex items-center gap-3 mb-2 text-slate-600">
                            <Server size={20} className="text-primary" />
                            <h3 className="font-semibold text-lg">{t.totalNodes}</h3>
                        </div>
                        <div className="text-4xl font-bold">
                            {sizing.totals.nodes} <span className="text-lg font-medium text-slate-500">{t.instances}</span>
                        </div>
                    </div>
                </div>

                {/* Tier Details - Full Width */}
                <div className="border border-slate-200 rounded-lg p-6 mb-6">
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
                                    hot: 'bg-orange-50 border-orange-200',
                                    warm: 'bg-yellow-50 border-yellow-200',
                                    cold: 'bg-blue-50 border-blue-200',
                                    frozen: 'bg-indigo-50 border-indigo-200'
                                };
                                const tierIconColors = {
                                    hot: 'bg-orange-100 text-orange-600',
                                    warm: 'bg-yellow-100 text-yellow-600',
                                    cold: 'bg-blue-100 text-blue-600',
                                    frozen: 'bg-indigo-100 text-indigo-600'
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
                                                    <div className="text-sm text-slate-600">{tier.totalNodes} {tier.totalNodes > 1 ? t.nodesSuffix : t.nodeSuffix}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-xl">
                                                    {tier.totalStorageGB >= 1000 
                                                        ? `${(tier.totalStorageGB / 1000).toFixed(2)} TB`
                                                        : `${tier.totalStorageGB.toFixed(2)} GB`
                                                    }
                                                </div>
                                                <div className="text-sm text-slate-600 flex items-center justify-end gap-2">
                                                    <span>{Math.round(tier.totalMemoryGB)} GB {t.ramSuffix}</span>
                                                    <span>•</span>
                                                    <span>{tier.totalShards} Shards</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Configurações e Cálculos */}
                                        <div className="pt-4 border-t border-slate-200 space-y-2">
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="text-xs">
                                                    <span className="text-slate-500">{t.volumePerDay}:</span>
                                                    <span className="ml-1 font-semibold">{tierConfig.volumePerDayGB} GB</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-slate-500">{t.retention}:</span>
                                                    <span className="ml-1 font-semibold">{tierConfig.retentionDays} dias</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-slate-500">{t.replicas}:</span>
                                                    <span className="ml-1 font-semibold">{tierConfig.replicas}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="text-xs">
                                                    <span className="text-slate-500">{t.growth}:</span>
                                                    <span className="ml-1 font-semibold">{state.global.growthPercentage}%</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-slate-500">{t.ramPerNode}:</span>
                                                    <span className="ml-1 font-semibold">{state.global.maxMemoryPerNode} GB</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-slate-500">{t.ratio}:</span>
                                                    <span className="ml-1 font-semibold">{state.global.tierRatios[tier.tierName as keyof typeof state.global.tierRatios]}:1</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Fórmula Aplicada */}
                                        <div className="mt-3 p-3 bg-white/70 rounded text-xs font-mono">
                                            <div className="text-slate-600">
                                                Storage = {tierConfig.volumePerDayGB} × {tierConfig.retentionDays} × {tierConfig.replicas + 1} × 1.25 × {(1 + state.global.growthPercentage / 100).toFixed(2)} = <span className="font-bold text-slate-900">{tier.totalStorageGB.toFixed(2)} GB</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Dedicated Roles - Full Width Below */}
                <div className="border border-slate-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Server size={18} className="text-primary" />
                        {t.dedicatedRoles}
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: t.masterNodes, data: sizing.master, icon: 'M', color: 'bg-purple-50 border-purple-200', iconColor: 'bg-purple-100 text-purple-600' },
                            { label: t.mlNodes, data: sizing.ml, icon: 'ML', color: 'bg-green-50 border-green-200', iconColor: 'bg-green-100 text-green-600' },
                            { label: t.coordNodes, data: sizing.coord, icon: 'C', color: 'bg-cyan-50 border-cyan-200', iconColor: 'bg-cyan-100 text-cyan-600' },
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
                                            <div className="text-sm text-slate-600">{role.data.nodes} {role.data.nodes !== 1 ? t.instances : t.nodeSuffix}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-xl">{role.data.storageGB} GB</div>
                                        <div className="text-sm text-slate-600">{role.data.memoryGB} GB {t.ramSuffix}</div>
                                    </div>
                                </div>
                                
                                {/* Configurações */}
                                <div className="pt-4 border-t border-slate-200 space-y-2">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-xs">
                                            <span className="text-slate-500">{t.diskPerNode}:</span>
                                            <span className="ml-1 font-semibold">{role.data.storageGB / role.data.nodes} GB</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-slate-500">{t.ramPerNode}:</span>
                                            <span className="ml-1 font-semibold">{role.data.memoryGB / role.data.nodes} GB</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-slate-500">{t.totalNodesLabel}:</span>
                                            <span className="ml-1 font-semibold">{role.data.nodes}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t-2 border-[#F9A825] text-center text-sm text-slate-600">
                    <p className="font-medium">
                        Elasticsearch/OpenSearch Sizing Calculator - {t.generatedBy} {new Date().toLocaleDateString('pt-BR')}
                    </p>
                    <p className="mt-2">
                        Tornis Tecnologia {new Date().getFullYear()} - {t.footerText} - 
                        <a 
                            href="https://www.tornis.com.br" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#F9A825] font-semibold hover:underline ml-1"
                        >
                            www.tornis.com.br
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
