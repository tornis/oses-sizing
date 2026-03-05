"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WizardState } from "@/context/WizardContext";
import { generateMermaidDiagram } from "@/utils/mermaidGenerator";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ArchitectureContent() {
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadMermaid = async () => {
            const mermaid = (await import("mermaid")).default;
            mermaid.initialize({ 
                startOnLoad: true,
                theme: 'base',
                themeVariables: {
                    primaryColor: '#F9A825',
                    primaryTextColor: '#fff',
                    primaryBorderColor: '#F9A825',
                    lineColor: '#1B2A4E',
                    secondaryColor: '#1B2A4E',
                    tertiaryColor: '#FDD835',
                    fontSize: '16px',
                    fontFamily: 'Arial, sans-serif',
                },
                flowchart: {
                    curve: 'basis',
                    padding: 20,
                    nodeSpacing: 50,
                    rankSpacing: 80,
                }
            });

            const stateJson = searchParams.get("state");
            if (!stateJson || !mermaidRef.current) return;

            try {
                const state: WizardState = JSON.parse(decodeURIComponent(stateJson));
                const mermaidCode = generateMermaidDiagram(state);
                
                const { svg } = await mermaid.render('mermaid-diagram', mermaidCode);
                mermaidRef.current.innerHTML = svg;
            } catch (error) {
                console.error("Error rendering Mermaid diagram:", error);
            }
        };

        loadMermaid();
    }, [searchParams]);

    const stateJson = searchParams.get("state");
    if (!stateJson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background">
                <p className="text-lg text-slate-500">{t.noDataFound}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-background py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
                >
                    <ArrowLeft size={20} />
                    {t.btnBack}
                </Link>

                <h1 className="text-4xl font-bold text-foreground mb-8">
                    {t.architectureTitle || "Cluster Architecture"}
                </h1>

                <div className="glass-card p-8">
                    <div ref={mermaidRef} className="flex justify-center items-center min-h-[400px]">
                        <p className="text-slate-500">{t.loadingArchitecture || "Loading architecture diagram..."}</p>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>{t.architectureNote || "This diagram shows the complete cluster architecture with all nodes and their resources."}</p>
                </div>
            </div>
        </div>
    );
}

export default function ArchitecturePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background">
                <p className="text-lg text-slate-500">Loading...</p>
            </div>
        }>
            <ArchitectureContent />
        </Suspense>
    );
}
