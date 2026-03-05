"use client";

import React from "react";
import { useWizard } from "@/context/WizardContext";
import { useLanguage } from "@/context/LanguageContext";
import StepUserInfo from "./StepUserInfo";
import StepGlobal from "./StepGlobal";
import StepConfig from "./StepConfig";
import StepTier from "./StepTier";
import StepArchitecture from "./StepArchitecture";
import StepDashboard from "./StepDashboard";
import { ChevronRight, ChevronLeft, CheckCircle2, Network } from "lucide-react";

export default function WizardForm() {
    const { state, currentStepIndex, setCurrentStepIndex, steps } = useWizard();
    const { t } = useLanguage();

    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;

    const nextStep = () => {
        if (!isLastStep) setCurrentStepIndex(currentStepIndex + 1);
    };

    const prevStep = () => {
        if (!isFirstStep) setCurrentStepIndex(currentStepIndex - 1);
    };

    const getStepTitle = (stepKey: string) => {
        switch (stepKey) {
            case "userinfo": return t.stepUserInfo;
            case "global": return t.stepGlobalSettings;
            case "config": return t.stepAdvancedConfigs;
            case "architecture": return t.stepArchitecture;
            case "results": return t.stepResults;
            case "hot": return t.stepHotTier;
            case "warm": return t.stepWarmTier;
            case "cold": return t.stepColdTier;
            case "frozen": return t.stepFrozenTier;
            default: return stepKey;
        }
    };

    const renderStepContent = () => {
        const stepName = steps[currentStepIndex];

        if (stepName === "userinfo") {
            return <StepUserInfo />;
        }
        if (stepName === "global") {
            return <StepGlobal />;
        }
        if (stepName === "config") {
            return <StepConfig />;
        }
        if (stepName === "architecture") {
            return <StepArchitecture />;
        }
        if (stepName === "results") {
            return <StepDashboard />;
        }

        // It must be a tier step string key (hot, warm, cold, frozen)
        if (["hot", "warm", "cold", "frozen"].includes(stepName)) {
            return <StepTier tierName={stepName as any} />;
        }

        return null;
    };
    
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validação de cada step
    const currentStep = steps[currentStepIndex];
    let isNextDisabled = false;
    
    if (currentStep === "userinfo") {
        // Valida nome, email e aceite dos termos
        isNextDisabled = !state.userInfo.name.trim() || !state.userInfo.email.trim() || !validateEmail(state.userInfo.email) || !state.userInfo.termsAccepted;
    } else if (currentStep === "global") {
        // Valida se pelo menos uma tier foi selecionada
        isNextDisabled = state.global.selectedTiers.length === 0;
    }

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8">

            {/* Sidebar Progress Tracker */}
            <div className="md:w-64 shrink-0 glass-card p-6 h-fit hidden md:block no-print">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
                    {t.sizingProgress}
                </h3>
                <div className="space-y-6">
                    {steps.map((step, idx) => {
                        const isActive = idx === currentStepIndex;
                        const isCompleted = idx < currentStepIndex;

                        return (
                            <div key={idx} className="flex items-center gap-3">
                                <div
                                    className={`flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300
                    ${isActive ? "border-primary text-primary" : ""}
                    ${isCompleted ? "bg-primary border-primary text-white" : ""}
                    ${!isActive && !isCompleted ? "border-slate-200 dark:border-slate-800 text-slate-400" : ""}
                  `}
                                >
                                    {isCompleted ? <CheckCircle2 size={16} /> : <span className="text-sm font-bold">{idx + 1}</span>}
                                </div>
                                <span
                                    className={`text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-slate-400"
                                        }`}
                                >
                                    {getStepTitle(step)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1">
                    {renderStepContent()}
                </div>

                {/* Navigation Footer */}
                <div className="mt-12 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6 no-print">
                    <button
                        onClick={prevStep}
                        disabled={isFirstStep}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isFirstStep
                            ? "opacity-0 cursor-default"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                    >
                        <ChevronLeft size={18} />
                        {t.btnBack}
                    </button>

                    {!isLastStep ? (
                        <button
                            onClick={nextStep}
                            disabled={isNextDisabled}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-white shadow-lg ${isNextDisabled
                                ? "bg-slate-300 cursor-not-allowed dark:bg-slate-700 shadow-none"
                                : "bg-primary hover:bg-blue-600 hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
                                }`}
                        >
                            {t.btnContinue}
                            <ChevronRight size={18} />
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const stateJson = encodeURIComponent(JSON.stringify(state));
                                    window.open(`/architecture?state=${stateJson}`, '_blank');
                                }}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-white shadow-lg bg-primary hover:bg-opacity-90 hover:shadow-primary/25 hover:-translate-y-0.5"
                            >
                                <Network size={18} />
                                {t.btnViewArchitecture}
                            </button>
                            <button
                                onClick={() => {
                                    const stateJson = encodeURIComponent(JSON.stringify(state));
                                    window.open(`/print?state=${stateJson}`, '_blank');
                                }}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-white shadow-lg bg-success hover:bg-emerald-600 hover:shadow-success/25 hover:-translate-y-0.5"
                            >
                                {t.btnExport}
                                <CheckCircle2 size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
