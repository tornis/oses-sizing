"use client";

import { WizardProvider } from "@/context/WizardContext";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import WizardForm from "@/components/Wizard/WizardForm";
import ExplanationModal from "@/components/Modal/ExplanationModal";
import LanguageSwitcher from "@/components/Wizard/LanguageSwitcher";
import Image from "next/image";

function MainContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-50 dark:bg-background">
      <LanguageSwitcher />
      {/* Decorative blurred background shapes - Removed to fix PDF export */}

      <main className="relative z-10 w-full min-h-screen py-16 px-4 md:px-8">
        <header className="max-w-5xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-6">
            <Image 
              src="/logo_tornis.png" 
              alt="Tornis Tecnologia" 
              width={240} 
              height={120}
              className="object-contain"
              priority
            />
            <div className="text-right">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {t.appSubtitle}
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2">
                {t.appTitle}
              </h2>
            </div>
          </div>
          <p className="text-lg text-slate-500 w-2xl mx-auto text-center font-light">
            {t.appDescription}
          </p>
        </header>

        <WizardProvider>
          <WizardForm />
        </WizardProvider>

        <ExplanationModal />

        {/* Footer */}
        <footer className="relative z-10 mt-16 py-6 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tornis Tecnologia {new Date().getFullYear()} - {t.footerText} - 
              <a 
                href="https://www.tornis.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1 font-medium"
              >
                www.tornis.com.br
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}
