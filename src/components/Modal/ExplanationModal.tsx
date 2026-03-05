"use client";

import React, { useState, useEffect } from "react";
import { Info, X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ExplanationModal() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xl rounded-full px-5 py-3 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 font-medium no-print"
            >
                <Info size={18} className="text-primary" />
                {t.howIsCalculated}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200"
                    >
                        <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Info className="text-primary" />
                                {t.modalTitle}
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-8 text-slate-600 dark:text-slate-300">
                            <section>
                                <p className="mb-4 text-lg">
                                    {t.modalIntro}
                                </p>
                                <a
                                    href="https://www.elastic.co/pt/blog/benchmarking-and-sizing-your-elasticsearch-cluster-for-logs-and-metrics"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-left"
                                >
                                    {t.modalSource}
                                    <ExternalLink size={16} />
                                </a>
                            </section>

                            <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">{t.modalSection1}</h3>
                                <p className="mb-4">
                                    {t.modalSec1Desc}
                                </p>
                                <div className="font-mono bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre">
                                    {t.modalSec1Code1}<br />
                                    {t.modalSec1Code2}
                                </div>
                            </section>

                            <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">{t.modalSection2}</h3>
                                <p className="mb-4">
                                    {t.modalSec2Desc}
                                </p>
                                <ul className="list-disc leading-relaxed mb-4 ml-6 space-y-1">
                                    <li><b>Hot Tier:</b> 16GB Storage per 1GB RAM</li>
                                    <li><b>Warm Tier:</b> 64GB Storage per 1GB RAM</li>
                                    <li><b>Cold Tier:</b> 128GB Storage per 1GB RAM</li>
                                    <li><b>Frozen Tier:</b> 1600GB Storage per 1GB RAM</li>
                                </ul>
                                <div className="font-mono bg-slate-900 text-blue-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre">
                                    {t.modalSec2Code}
                                </div>
                            </section>

                            <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">{t.modalSection3}</h3>
                                <p className="mb-4">
                                    {t.modalSec3Desc}
                                    <br /><br />
                                    <strong className="text-amber-600 dark:text-amber-500">{t.modalSec3Warning}</strong> {t.modalSec3WarningDesc}
                                </p>
                                <div className="font-mono bg-slate-900 text-purple-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre mb-4">
                                    {t.modalSec3Code}
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                                    <p className="text-sm">
                                        <strong className="text-emerald-700 dark:text-emerald-400">{t.modalSec3BestPractice}</strong> {t.modalSec3BestPracticeDesc}
                                    </p>
                                </div>
                            </section>

                            <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">{t.modalSection4}</h3>
                                <p className="mb-4">
                                    {t.modalSec4Desc}
                                </p>
                                <div className="font-mono bg-slate-900 text-orange-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre">
                                    {t.modalSec4Code}
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
