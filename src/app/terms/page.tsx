"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-background py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
                >
                    <ArrowLeft size={20} />
                    Voltar para a Calculadora
                </Link>

                <h1 className="text-4xl font-bold text-foreground mb-8">
                    Termos de Privacidade e Uso
                </h1>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Introdução</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Bem-vindo à Calculadora de Sizing Elastic/OpenSearch da Tornis Tecnologia. 
                            Estes Termos de Privacidade e Uso descrevem como coletamos, usamos e protegemos 
                            suas informações pessoais ao utilizar nossa ferramenta de dimensionamento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Coleta de Dados</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                            Coletamos as seguintes informações quando você utiliza nossa calculadora:
                        </p>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                            <li><strong>Informações de Identificação:</strong> Nome completo e endereço de e-mail</li>
                            <li><strong>Dados de Configuração:</strong> Parâmetros técnicos inseridos na calculadora (volumes de dados, configurações de cluster, etc.)</li>
                            <li><strong>Dados de Uso:</strong> Informações sobre como você interage com a ferramenta</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. Finalidade do Uso dos Dados</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                            Utilizamos seus dados exclusivamente para:
                        </p>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                            <li><strong>Melhoria da Experiência:</strong> Aprimorar a precisão e usabilidade da calculadora</li>
                            <li><strong>Desenvolvimento de Funcionalidades:</strong> Identificar necessidades e desenvolver novos recursos</li>
                            <li><strong>Suporte Técnico:</strong> Fornecer assistência quando necessário</li>
                            <li><strong>Comunicação:</strong> Enviar atualizações sobre melhorias na ferramenta (com seu consentimento)</li>
                            <li><strong>Análise Estatística:</strong> Compreender padrões de uso para otimizar a solução</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Armazenamento e Segurança</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Seus dados são armazenados em servidores seguros com criptografia adequada. 
                            Implementamos medidas técnicas e organizacionais para proteger suas informações 
                            contra acesso não autorizado, alteração, divulgação ou destruição.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. Compartilhamento de Dados</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            A Tornis Tecnologia <strong>não vende, aluga ou compartilha</strong> suas informações 
                            pessoais com terceiros para fins comerciais. Seus dados são utilizados exclusivamente 
                            internamente para os propósitos descritos nestes termos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Seus Direitos</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                        </p>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                            <li>Acessar seus dados pessoais</li>
                            <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                            <li>Solicitar a exclusão de seus dados</li>
                            <li>Revogar seu consentimento a qualquer momento</li>
                            <li>Solicitar a portabilidade de seus dados</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">7. Retenção de Dados</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas 
                            nestes termos, salvo se um período de retenção maior for exigido ou permitido por lei.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">8. Cookies e Tecnologias Similares</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
                            analisar o uso da ferramenta e personalizar conteúdo. Você pode gerenciar 
                            suas preferências de cookies através das configurações do seu navegador.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">9. Alterações nestes Termos</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Reservamo-nos o direito de atualizar estes Termos de Privacidade e Uso periodicamente. 
                            Notificaremos você sobre alterações significativas através do e-mail fornecido ou 
                            através de aviso em nossa ferramenta.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">10. Contato</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                            Para exercer seus direitos ou esclarecer dúvidas sobre estes termos, entre em contato:
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                            <p className="text-slate-600 dark:text-slate-400">
                                <strong>Tornis Tecnologia</strong><br />
                                Website: <a href="https://www.tornis.com.br" className="text-primary hover:underline">www.tornis.com.br</a><br />
                                E-mail: contato@tornis.com.br
                            </p>
                        </div>
                    </section>

                    <section className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-8">
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            <strong>Última atualização:</strong> Março de 2026
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                            Ao utilizar a Calculadora de Sizing Elastic/OpenSearch, você concorda com estes 
                            Termos de Privacidade e Uso.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
