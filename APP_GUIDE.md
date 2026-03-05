Planejamento do Simulador de Sizing Elasticsearch / Opensearch
Esta aplicação será um simulador passo a passo dinâmico para calcular o dimensionamento (sizing) de clusters Elasticsearch ou OpenSearch, com uma experiência de usuário (UX) premium.

Resumo do Problema e Objetivo
O usuário possui uma planilha que calcula o total de instâncias, capacidade de armazenamento e memória de um cluster Elasticsearch/Opensearch baseado em volumetria, retenção e tolerâncias. O objetivo é transformar essa planilha em um "Wizard" Step-by-Step, utilizando Next.js e React com CSS puro/Modules, incorporando técnicas modernas de usabilidade, cores agradáveis (dark mode), micro-interações e glassmorphism.

User Review Required
IMPORTANT

A aplicação usará Next.js, React, e CSS/CSS Modules padrão (em vez de frameworks como Tailwind), garantindo foco na implementação do design system personalizado para manter a estética impecável solicitada. O setup será feito via npx create-next-app na própria raiz do seu repositório atual (ou seja, criaremos os arquivos base do Next.js). Por favor aprove a estruturação abaixo.

Lógica Algorítmica (Baseada na Planilha e Documentação Oficial)
Fonte do cálculo de referência: Benchmarking and Sizing your Elasticsearch Cluster

Fatores de Ratio Configuráveis (Padrões em GB Armazenamento por 1GB RAM):

Hot: 16
Warm: 64
Cold: 128
Frozen: 1600
Cálculo Base (Por Camada):

Armazenamento (GB) = Volumetria_Dia * Retenção_Dias * (Réplicas + 1) * 1.25 * (1 + Crescimento_Percentual)
Memória Necessária (GB) = Armazenamento (GB) / Ratio_Configurado_da_Camada
Quantidade de Nodes = Math.ceil( Memória Necessária / Memória_Por_Node_Disponivel ) (Nota importante: A memória disponível por Node será limitada a um máximo de 64 GB de RAM, conforme limitação técnica do Elasticsearch/OpenSearch).
Quantidade de Shards por Camada = Math.ceil( Armazenamento (GB) / Tamanho_Máximo_do_Shard_GB ) (Nota: O limite padrão de um Shard não deve ultrapassar 50GB, mas também será configurável).
Também serão somados os nodes de Master, Coordinator e Machine Learning caso o usuário os habilite.

Proposed Changes
A arquitetura do projeto será componentizada nos seguintes passos do Wizard:

1. Inicialização do Projeto
Rodar o comando Next.js: npx -y create-next-app@latest . --typescript --eslint --app --src-dir --import-alias "@/*" --use-npm executado no workspace c:\Users\rtorn\oses-sizing.
Limpeza dos arquivos base do Next.js e configuração do app/globals.css com variáveis de cor premium e dark mode.
2. Componentes Front-end
src/context/WizardContext.tsx: Contexto React para guardar as respostas (Estado global da simulação), de modo que o usuário consiga avançar e voltar etapas sem perder os dados.
src/utils/calculations.ts: Funções puras que receberão os inputs (volumetria, nodes, % crescimento) e retornarão o Output final pronto.
src/components/Wizard/StepGlobal.tsx: Formulário inicial perguntando a Memória por Node (máx 64 GB), % de Crescimento esperado, e quais camadas a arquitetura terá.
src/components/Wizard/StepConfig.tsx: [NOVO] Tela de "Configurações Avançadas" para o usuário alterar o Ratio (Armazenamento/RAM) de cada camada e o Tamanho Máximo do Shard (padrão 50GB).
src/components/Wizard/StepTier.tsx: Tela dinâmica instanciada para cada camada selecionada (inputs de Volumetria, Retenção, Réplicas).
src/components/Wizard/StepArchitecture.tsx: Inputs simples para Master, ML Nodes e Coordinator Nodes.
src/components/Wizard/StepDashboard.tsx: Dashboard final com ícones lucide-react exibindo Storage, RAM, Nodes totais, e agora a quantidade estimada de Shards.
src/components/Modal/ExplanationModal.tsx: [NOVO] Modal acessível a qualquer momento pelo usuário. Irá renderizar a fórmula matemática usada para chegar nos resultados e referenciar a Documentação Oficial, garantindo transparência.
3. Internacionalização (i18n) [NOVO]
Para suportar Inglês (en), Português (pt-BR) e Espanhol (es), criaremos um sistema leve de tradução:

src/context/LanguageContext.tsx: Gerenciará o idioma atual escolhido pelo usuário.
src/locales/(en|pt|es).ts: Dicionários contendo as chaves de tradução de toda a aplicação.
Language Switcher: Um componente no Header principal da aplicação permitindo a troca em tempo real.
4. Exportação em PDF [NOVO]
No StepDashboard, o botão de "Export / Print" será aprimorado para gerar um arquivo PDF estilizado do relatório:

A biblioteca html2canvas e jspdf serão utilizadas para capturar o layout atual do Dashboard de resultados e baixar um documento PDF diretamente no navegador do usuário, sem precisar de backend.
Verification Plan
Testes Funcionais
O Wizard contará com lógicas de validação (o usuário não pode avançar o passo se não preencher os inputs necessários). O simulador será testado localmente:

Rodar npm run dev.
Navegar para http://localhost:3000.
Inserir Exatamente os Mesmos Dados avaliados na planilha original:
HOT: 2GB/dia, 1 dia retenção, 1 Réplica, 10% crescimento, 64GB de Máquina.
FROZEN: 4000 GB/dia, 180 dias de retenção, 0 Réplica, 10% crescimento.
Validar se o output será igual à planilha: Armazenamento em HOT = ~5.5GB (1 Node); FROZEN = ~990TB de Storage e 619GB RAM (10 Nodes).
Garantir que o Total do Cluster corresponda a 15 Nodes como ditado pela planilha.