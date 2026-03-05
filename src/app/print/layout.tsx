import { LanguageProvider } from "@/context/LanguageContext";

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
