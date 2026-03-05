import { LanguageProvider } from "@/context/LanguageContext";

export default function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
