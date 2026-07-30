import React, { useState, useRef } from "react";
import {
  BookOpen,
  Printer,
  ChevronLeft,
  ChevronRight,
  Search,
  Zap,
  CheckCircle2,
  Sparkles,
  Share2,
  FileText,
  LayoutGrid,
  GraduationCap,
  Target,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Building2,
  TrendingUp,
  DollarSign,
  Cpu,
  Users,
  Award,
  Clock,
  HelpCircle
} from "lucide-react";
import { getAllSiglas } from "../data/dataService";
import { Sigla } from "../types";

interface EbookViewProps {
  navigate: (to: string) => void;
}

// Estrutura de Sigla para o E-book com macetes didáticos de memorização acelerada
interface EbookTerm {
  sigla: string;
  nomeIngles: string;
  nomePortugues: string;
  categoria: "Alta Gestão" | "Finanças & Métricas" | "Marketing & Growth" | "Tecnologia & Operações" | "RH & Pessoas";
  explicacaoCurta: string;
  contextoReuniao: string;
  exemploReal: string;
  maceteMemorizacao: string;
}

const EBOOK_TERMS: EbookTerm[] = [
  // ALTA GESTÃO & ESTRATÉGIA
  {
    sigla: "EBITDA",
    nomeIngles: "Earnings Before Interest, Taxes, Depreciation, and Amortization",
    nomePortugues: "Lucros Antes de Juros, Impostos, Depreciação e Amortização",
    categoria: "Alta Gestão",
    explicacaoCurta: "Mede o lucro puro da operação da empresa, excluindo custos financeiros, impostos e perdas de bens.",
    contextoReuniao: "Usado em reuniões de resultados trimestrais para avaliar se a operação em si dá dinheiro.",
    exemploReal: "Nosso EBITDA subiu 18% neste trimestre porque reduzimos custos de fornecedores sem perder vendas.",
    maceteMemorizacao: "EBITDA = 'Lucro Operacional Sem Frescura'. Se o EBITDA for positivo, a operação é saudável."
  },
  {
    sigla: "OKR",
    nomeIngles: "Objectives and Key Results",
    nomePortugues: "Objetivos e Resultados-Chave",
    categoria: "Alta Gestão",
    explicacaoCurta: "Metodologia de gestão de metas que conecta objetivos ambiciosos a métricas mensuráveis.",
    contextoReuniao: "Definido no início de trimestres para alinhar o foco das equipes com a meta global da empresa.",
    exemploReal: "Nosso OKR do Q3 é aumentar o NPS em 15 pontos e bater R$ 2 mi de faturamento recorrente.",
    maceteMemorizacao: "Objective = 'Aonde queremos chegar'. Key Results = 'Como sabemos que chegamos lá'."
  },
  {
    sigla: "SLA",
    nomeIngles: "Service Level Agreement",
    nomePortugues: "Acordo de Nível de Serviço",
    categoria: "Alta Gestão",
    explicacaoCurta: "Contrato formal que estabelece o tempo máximo e a qualidade exigida para entregar um serviço.",
    contextoReuniao: "Cobrado em reuniões operacionais e de TI quando há atrasos na resposta ao cliente ou internamente.",
    exemploReal: "O SLA do time de suporte para resolver chamados críticos é de até 2 horas.",
    maceteMemorizacao: "SLA = 'Prazo Limite Combinado'. Estourar o SLA é atrasar a entrega prometida."
  },
  {
    sigla: "CEO",
    nomeIngles: "Chief Executive Officer",
    nomePortugues: "Diretor Executivo / Presidente",
    categoria: "Alta Gestão",
    explicacaoCurta: "O cargo mais alto da hierarquia executiva, responsável pelas decisões estratégicas finais da empresa.",
    contextoReuniao: "Referenciado quando uma decisão precisa de validação do nível estratégico máximo.",
    exemploReal: "A proposta foi aprovada pela diretoria e passará pelo CEO antes da assinatura.",
    maceteMemorizacao: "CEO = 'O Chefe Supremo'. É quem responde pelo futuro da empresa perante o conselho."
  },
  {
    sigla: "KPI",
    nomeIngles: "Key Performance Indicator",
    nomePortugues: "Indicador-Chave de Desempenho",
    categoria: "Alta Gestão",
    explicacaoCurta: "Métrica quantitativa usada para medir se um processo ou projeto está alcançando seu objetivo.",
    contextoReuniao: "Acompanhado semanalmente em dashboards de gestão para orientar decisões rápidas.",
    exemploReal: "O principal KPI do time de vendas neste mês é a taxa de conversão de reuniões em contratos.",
    maceteMemorizacao: "KPI = 'O Termômetro do Negócio'. Se o KPI está vermelho, o processo precisa de ajustes."
  },

  // FINANÇAS & MÉTRICAS
  {
    sigla: "ROI",
    nomeIngles: "Return on Investment",
    nomePortugues: "Retorno sobre o Investimento",
    categoria: "Finanças & Métricas",
    explicacaoCurta: "Métrica financeira que mostra quanto dinheiro a empresa ganhou ou perdeu em relação ao valor investido.",
    contextoReuniao: "Cobrado por diretores ao analisar a compra de softwares, eventos ou campanhas de marketing.",
    exemploReal: "O ROI do novo software de automação foi de 300% no primeiro semestre.",
    maceteMemorizacao: "ROI = '(Ganho - Custo) ÷ Custo'. Ganhou mais do que gastou? O ROI é positivo."
  },
  {
    sigla: "CAC",
    nomeIngles: "Customer Acquisition Cost",
    nomePortugues: "Custo de Aquisição de Cliente",
    categoria: "Finanças & Métricas",
    explicacaoCurta: "Valor total investido em marketing e vendas para conseguir atrair um novo cliente pagante.",
    contextoReuniao: "Analisado em reuniões de crescimento. Quanto menor o CAC, mais eficiente é a área comercial.",
    exemploReal: "Reduzimos o CAC de R$ 150 para R$ 90 ao otimizar nossas campanhas no Google Ads.",
    maceteMemorizacao: "CAC = 'O Preço de Cada Cliente Novo'. Custo de Vendas ÷ Número de Clientes Conquistados."
  },
  {
    sigla: "LTV",
    nomeIngles: "Lifetime Value",
    nomePortugues: "Valor do Ciclo de Vida do Cliente",
    categoria: "Finanças & Métricas",
    explicacaoCurta: "A receita total estimada que um único cliente gera para a empresa durante todo o tempo de contrato.",
    contextoReuniao: "Comparado diretamente com o CAC. A regra de ouro no mercado é ter LTV pelo menos 3x maior que o CAC.",
    exemploReal: "Nosso LTV médio é de R$ 3.600, o que garante uma margem excelente para investir na atração.",
    maceteMemorizacao: "LTV = 'Quanto o cliente deixa no seu bolso ao longo dos anos'. LTV alto = Negócio escalável."
  },
  {
    sigla: "P&L",
    nomeIngles: "Profit and Loss Statement",
    nomePortugues: "Demonstração de Resultados (DRE)",
    categoria: "Finanças & Métricas",
    explicacaoCurta: "Relatório financeiro detalhado com todas as receitas, custos e despesas em determinado período.",
    contextoReuniao: "Apresentado mensalmente aos sócios para avaliar a saúde financeira geral da operação.",
    exemploReal: "Revisaremos o P&L do departamento amanhã para identificar onde podemos cortar custos fixos.",
    maceteMemorizacao: "P&L = 'Receitas menos Despesas'. É a balança final do dinheiro que entrou e saiu."
  },
  {
    sigla: "Burn Rate",
    nomeIngles: "Burn Rate",
    nomePortugues: "Taxa de Queima de Caixa",
    categoria: "Finanças & Métricas",
    explicacaoCurta: "A velocidade mensal com que uma empresa gasta seu capital de reserva antes de gerar lucro.",
    contextoReuniao: "Crucial em startups e novos projetos para calcular até quando dura o dinheiro em caixa (Runway).",
    exemploReal: "Nosso Burn Rate atual é de R$ 80 mil/mês, o que nos dá 12 meses de runway antes do novo aporte.",
    maceteMemorizacao: "Burn Rate = 'A velocidade da fogueira de dinheiro'. Queimar mais rápido exige faturar mais rápido."
  },

  // MARKETING & GROWTH
  {
    sigla: "B2B",
    nomeIngles: "Business to Business",
    nomePortugues: "Empresa para Empresa",
    categoria: "Marketing & Growth",
    explicacaoCurta: "Modelo de negócio em que empresas vendem produtos ou serviços diretamente para outras empresas.",
    contextoReuniao: "Usado para definir a estratégia comercial, prazos de negociação e abordagem do produto.",
    exemploReal: "Nossa solução é 100% B2B, focada em médias e grandes empresas do setor industrial.",
    maceteMemorizacao: "B2B = 'Venda Corporativa'. Negociações mais longas e ticket médio mais alto."
  },
  {
    sigla: "B2C",
    nomeIngles: "Business to Consumer",
    nomePortugues: "Empresa para Consumidor Final",
    categoria: "Marketing & Growth",
    explicacaoCurta: "Modelo de negócio direcionado à venda de produtos ou serviços para pessoas físicas.",
    contextoReuniao: "Usado em discussões de varejo, e-commerce e estratégias de grandes públicos.",
    exemploReal: "No B2C, a decisão de compra é mais emocional e imediata do que no B2B.",
    maceteMemorizacao: "B2C = 'Venda para o consumidor da ponta' (ex: e-commerce de roupas ou supermercado)."
  },
  {
    sigla: "CRM",
    nomeIngles: "Customer Relationship Management",
    nomePortugues: "Gestão do Relacionamento com o Cliente",
    categoria: "Marketing & Growth",
    explicacaoCurta: "Software e estratégia para organizar, acompanhar e automatizar todas as interações com clientes.",
    contextoReuniao: "Mencionado em reuniões de vendas para cobrar atualização de contatos e status de propostas.",
    exemploReal: "Se a proposta não for registrada no CRM, ela não entra na comissão do mês.",
    maceteMemorizacao: "CRM = 'O Histórico Organizado de Vendas'. Ex: HubSpot, Salesforce, RD Station."
  },
  {
    sigla: "MoM",
    nomeIngles: "Month over Month",
    nomePortugues: "Mês a Mês",
    categoria: "Marketing & Growth",
    explicacaoCurta: "Comparação percentual do crescimento do mês atual em relação ao mês imediatamente anterior.",
    contextoReuniao: "Utilizado em relatórios mensais para checar a velocidade do crescimento a curto prazo.",
    exemploReal: "Crescemos 12% MoM no número de novos assinantes ativos.",
    maceteMemorizacao: "MoM = 'Mês Atual vs Mês Passado'. Avalia a consistência mensal do projeto."
  },
  {
    sigla: "CTA",
    nomeIngles: "Call to Action",
    nomePortugues: "Chamada para Ação",
    categoria: "Marketing & Growth",
    explicacaoCurta: "Instrução clara e direta em um e-mail, site ou anúncio pedindo para o usuário tomar uma atitude.",
    contextoReuniao: "Debatido na criação de campanhas para aumentar os cliques ou inscrições de leads.",
    exemploReal: "Precisamos mudar o CTA da página de vendas para 'Fazer Teste Grátis de 7 Dias'.",
    maceteMemorizacao: "CTA = 'O Botão do Clique'. É a ordem clara de o que fazer a seguir."
  },

  // TECNOLOGIA & OPERAÇÕES
  {
    sigla: "MVP",
    nomeIngles: "Minimum Viable Product",
    nomePortugues: "Produto Mínimo Viável",
    categoria: "Tecnologia & Operações",
    explicacaoCurta: "Versão simplificada de um produto com recursos suficientes para ser testado no mercado real.",
    contextoReuniao: "Usado para evitar gastar meses criando algo complexo sem validar a demanda dos usuários.",
    exemploReal: "Vamos lançar um MVP do aplicativo em 30 dias para validar o interesse dos primeiros usuários.",
    maceteMemorizacao: "MVP = 'Lançar Simples e Rápido para Testar'. Aprenda rápido com feedbacks reais."
  },
  {
    sigla: "SaaS",
    nomeIngles: "Software as a Service",
    nomePortugues: "Software como Serviço",
    categoria: "Tecnologia & Operações",
    explicacaoCurta: "Modelo de distribuição de softwares acessados via nuvem através de uma assinatura periódica.",
    contextoReuniao: "Comum ao negociar licenças de ferramentas corporativas ou criar startups digitais.",
    exemploReal: "A empresa migrou toda a infraestrutura para soluções SaaS para reduzir custos de manutenção.",
    maceteMemorizacao: "SaaS = 'Software por Assinatura na Nuvem' (ex: Netflix, Google Workspace, Zoom)."
  },
  {
    sigla: "API",
    nomeIngles: "Application Programming Interface",
    nomePortugues: "Interface de Programação de Aplicação",
    categoria: "Tecnologia & Operações",
    explicacaoCurta: "Conjunto de pontes tecnológicas que permitem que dois sistemas ou softwares diferentes se comuniquem.",
    contextoReuniao: "Mencionado ao integrar meios de pagamento, CRM, WhatsApp ou sistemas internos.",
    exemploReal: "Conectamos o formulário do site direto ao CRM através da API de integração.",
    maceteMemorizacao: "API = 'O Garçom Tecnológico'. Leva o pedido de um sistema até outro e traz a resposta."
  },
  {
    sigla: "ERP",
    nomeIngles: "Enterprise Resource Planning",
    nomePortugues: "Planejamento de Recursos Empresariais",
    categoria: "Tecnologia & Operações",
    explicacaoCurta: "Sistema central que unifica estoque, finanças, compras, emissão de notas e RH em um só banco de dados.",
    contextoReuniao: "Debatido em grandes reformulações operacionais ou auditorias contábeis.",
    exemploReal: "Todas as notas fiscais emitidas hoje são sincronizadas automaticamente com o ERP.",
    maceteMemorizacao: "ERP = 'O Cérebro da Operação' (ex: SAP, Totvs, Conta Azul, Bling)."
  },

  // RECURSOS HUMANOS & PESSOAS
  {
    sigla: "HRBP",
    nomeIngles: "Human Resources Business Partner",
    nomePortugues: "Parceiro Estratégico de Recursos Humanos",
    categoria: "RH & Pessoas",
    explicacaoCurta: "Profissional de RH que atua dentro das áreas de negócio para alinhar gestão de pessoas e metas.",
    contextoReuniao: "Acionado para resolver planos de carreira, contratações chave e retenção de talentos.",
    exemploReal: "Nossa HRBP desenhou um plano de desenvolvimento individual para os novos líderes.",
    maceteMemorizacao: "HRBP = 'O RH Focado no Negócio'. Não cuida de burocracias, cuida da estratégia de pessoas."
  },
  {
    sigla: "NPS",
    nomeIngles: "Net Promoter Score",
    nomePortugues: "Índice de Lealdade do Cliente",
    categoria: "RH & Pessoas",
    explicacaoCurta: "Métrica universal de satisfação que pergunta 'De 0 a 10, o quanto você recomendaria nossa empresa?'.",
    contextoReuniao: "Cobrado em avaliações de atendimento, produto e clima organizacional interno.",
    exemploReal: "Nosso NPS subiu de 65 para 82 após a reformulação do suporte ao cliente.",
    maceteMemorizacao: "NPS = 'Promotores minus Detratores'. Mede quem ama e quem odeia sua marca."
  },
  {
    sigla: "PPD",
    nomeIngles: "Personal and Professional Development",
    nomePortugues: "Plano de Desenvolvimento Individual (PDI)",
    categoria: "RH & Pessoas",
    explicacaoCurta: "Documento alinhado entre gestor e colaborador com metas de aprendizado e habilidades a desenvolver.",
    contextoReuniao: "Revisado em reuniões 1-on-1 (um a um) periódicas para definir promoções e treinamentos.",
    exemploReal: "No meu PDI deste ano, defini como meta dominar a análise de dados e acelerar siglas corporativas.",
    maceteMemorizacao: "PDI / PPD = 'O Roteiro da Sua Promoção'. O mapa de habilidades para subir de cargo."
  }
];

export default function EbookView({ navigate }: EbookViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"reader" | "grid">("reader");
  const [searchFilter, setSearchFilter] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const ebookContainerRef = useRef<HTMLDivElement>(null);

  // Filtragem de siglas no ebook se o usuário pesquisar
  const filteredTerms = EBOOK_TERMS.filter(
    (term) =>
      searchFilter.trim() === "" ||
      term.sigla.toLowerCase().includes(searchFilter.toLowerCase()) ||
      term.nomeIngles.toLowerCase().includes(searchFilter.toLowerCase()) ||
      term.nomePortugues.toLowerCase().includes(searchFilter.toLowerCase()) ||
      term.categoria.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Dividir o conteúdo em páginas A4 lógicas
  // Página 1: Capa
  // Página 2: Sumário & O Método de Aprendizado Acelerado
  // Página 3: Módulo 1 - Alta Gestão & Estratégia
  // Página 4: Módulo 2 - Finanças & Métricas
  // Página 5: Módulo 3 - Marketing & Growth
  // Página 6: Módulo 4 - Tecnologia & Operações
  // Página 7: Módulo 5 - Recursos Humanos & Pessoas
  // Página 8: Plano de Ação em 7 Dias & Conclusão
  const totalPages = 8;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white py-6 sm:py-10 px-3 sm:px-6">
      {/* Top Action Bar & Header Controls (Hidden when printing) */}
      <div className="max-w-5xl mx-auto mb-6 sm:mb-8 print:hidden">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center space-x-2 text-xs sm:text-sm text-[#7C8AA5] hover:text-[#00C2A8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dicionário</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] sm:text-xs bg-[#00C2A8]/10 text-[#00C2A8] border border-[#00C2A8]/30 px-3 py-1 rounded-full font-bold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Formato A4 • Edição Especial</span>
            </span>
          </div>
        </div>

        {/* Ebook Title Banner */}
        <div className="bg-[#0B1727] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#00C2A8] uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>E-book Exclusivo em Alta Definição</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Acelerador de Siglas Corporativas
              </h1>
              <p className="text-xs sm:text-sm text-[#B6C2D0] max-w-2xl leading-relaxed">
                Consulte, aprenda e memorize as siglas mais usadas pelas maiores empresas. Formatado em folhas A4 padrão para leitura digital agradável ou impressão em PDF.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-[#00C2A8] hover:bg-[#00e6c7] text-[#07111F] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-[#00C2A8]/20 flex items-center space-x-2 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Salvar PDF / Imprimir</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2.5 bg-[#111C31] hover:bg-[#182642] text-[#B6C2D0] hover:text-white border border-white/10 text-xs sm:text-sm rounded-xl transition-all flex items-center space-x-1.5"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? "Link Copiado!" : "Compartilhar"}</span>
              </button>
            </div>
          </div>

          {/* Reader toolbar: Page switcher, view modes, and quick search */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#111C31] p-1 rounded-xl border border-white/5 w-full sm:w-auto">
              <button
                onClick={() => setViewMode("reader")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  viewMode === "reader"
                    ? "bg-[#00C2A8] text-[#07111F] shadow"
                    : "text-[#7C8AA5] hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Modo Leitura (A4)</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-[#00C2A8] text-[#07111F] shadow"
                    : "text-[#7C8AA5] hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Visão Geral (Todas)</span>
              </button>
            </div>

            {/* Page Navigation Controls for Reader Mode */}
            {viewMode === "reader" && (
              <div className="flex items-center space-x-2 bg-[#111C31] px-3 py-1.5 rounded-xl border border-white/5 text-[#B6C2D0]">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-[#B6C2D0]"
                  title="Página Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-white text-xs">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-[#B6C2D0]"
                  title="Próxima Página"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Instant Filter Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#00C2A8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar no E-book (ex: EBITDA)..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#111C31] border border-white/10 rounded-xl text-xs text-white placeholder-[#7C8AA5] focus:outline-none focus:border-[#00C2A8]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* E-BOOK SHEETS CONTAINER (PRINTABLE AND RENDERED IN TRUE A4 PROPORTIONS) */}
      {/* ========================================================================= */}
      <div ref={ebookContainerRef} className="max-w-[800px] mx-auto space-y-10">
        
        {/* ================= PAGE 1: COVER (CAPA DO EBOOK) ================= */}
        {(viewMode === "grid" || currentPage === 1) && (
          <div className="a4-sheet bg-gradient-to-b from-[#0B1727] via-[#07111F] to-[#0D1E36] text-white p-8 sm:p-12 rounded-2xl border-2 border-[#00C2A8]/40 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[1050px] aspect-[1/1.414] print:shadow-none print:border-none print:rounded-none print:p-8 print:m-0 print:w-full print:h-screen print:page-break-after-always">
            
            {/* Background Decorative Accent Rings */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2A8]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header Brand Badge */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#00C2A8] text-[#07111F] font-black flex items-center justify-center shadow-lg shadow-[#00C2A8]/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-white">
                    DICIONÁRIO CORPORATIVO BRASIL
                  </h3>
                  <span className="text-[10px] text-[#00C2A8] font-bold tracking-widest uppercase block">
                    EDIÇÃO EXCLUSIVA DE ACELERAÇÃO DA CARREIRA
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono bg-[#111C31] text-[#00C2A8] border border-[#00C2A8]/40 px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                FORMATO A4 • 2026
              </span>
            </div>

            {/* Main Cover Body */}
            <div className="relative z-10 my-auto space-y-6 py-8">
              <div className="inline-flex items-center space-x-2 bg-[#00C2A8]/15 border border-[#00C2A8]/40 px-4 py-1.5 rounded-full text-xs font-bold text-[#00C2A8]">
                <Zap className="w-4 h-4 text-[#00C2A8]" />
                <span>MÉTODO DE CONSULTA & APRENDIZADO ACELERADO</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-black leading-tight text-white tracking-tight">
                  Acelerador de <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2A8] via-[#00E5FF] to-[#38BDF8]">
                    Siglas Corporativas
                  </span>
                </h1>
                <p className="text-base sm:text-xl font-medium text-[#B6C2D0] leading-relaxed max-w-xl">
                  O Guia Prático para entender, memorizar e dominar os termos mais usados no ambiente de trabalho em tempo recorde.
                </p>
              </div>

              {/* The Promise Highlight Box */}
              <div className="bg-[#111C31]/90 border-l-4 border-[#00C2A8] p-5 rounded-r-2xl space-y-2 shadow-xl backdrop-blur-sm">
                <span className="text-xs font-bold text-[#00C2A8] uppercase tracking-wider flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>A Promessa Inegociável deste E-book:</span>
                </span>
                <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                  "Consulte e entenda qualquer sigla corporativa em <strong className="text-[#00C2A8] font-bold">menos de 3 segundos</strong> durante reuniões, e-mails ou conversas com diretores — sem hesitar, sem passar vergonha e sem precisar perguntar o óbvio."
                </p>
              </div>

              {/* Badges Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="bg-[#07111F]/80 p-3.5 rounded-xl border border-white/10 text-center space-y-1">
                  <span className="block text-lg font-extrabold text-[#00C2A8]">100%</span>
                  <span className="block text-[10px] text-[#7C8AA5] uppercase font-bold">Exemplos Reais</span>
                </div>
                <div className="bg-[#07111F]/80 p-3.5 rounded-xl border border-white/10 text-center space-y-1">
                  <span className="block text-lg font-extrabold text-[#00E5FF]">3 Segs</span>
                  <span className="block text-[10px] text-[#7C8AA5] uppercase font-bold">Velocidade de Busca</span>
                </div>
                <div className="bg-[#07111F]/80 p-3.5 rounded-xl border border-white/10 text-center space-y-1">
                  <span className="block text-lg font-extrabold text-[#38BDF8]">5 Áreas</span>
                  <span className="block text-[10px] text-[#7C8AA5] uppercase font-bold">Gestão & Finanças</span>
                </div>
              </div>
            </div>

            {/* Cover Footer */}
            <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-[#7C8AA5]">
              <div>
                <p className="font-bold text-white">Elaborado pela Equipe de Conteúdo Corporativo</p>
                <p className="text-[11px]">siglascorporativasaprender.com.br</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#00C2A8]">Página 1 / {totalPages}</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 2: SUMÁRIO & MÉTODO (MÉTODO EM 3 PASSOS) ================= */}
        {(viewMode === "grid" || currentPage === 2) && (
          <div className="a4-sheet bg-[#0B1727] text-white p-8 sm:p-12 rounded-2xl border border-white/10 shadow-2xl relative min-h-[1050px] aspect-[1/1.414] flex flex-col justify-between print:shadow-none print:border-none print:rounded-none print:p-8 print:m-0 print:w-full print:h-screen print:page-break-after-always">
            
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold text-[#00C2A8] uppercase tracking-wider">
                Acelerador de Siglas Corporativas • Sumário & Método
              </span>
              <span className="text-xs font-mono text-[#7C8AA5]">Página 2</span>
            </div>

            {/* Page Content */}
            <div className="my-auto space-y-8 py-6">
              
              {/* Table of Contents */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#00C2A8]" />
                  <span>Sumário Executivo</span>
                </h2>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center justify-between p-3 bg-[#111C31] rounded-xl border border-white/5">
                    <span className="font-semibold text-white">Módulo 1: As Siglas Obrigatórias da Alta Gestão & Estratégia</span>
                    <span className="font-mono text-[#00C2A8] font-bold">Página 3</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111C31] rounded-xl border border-white/5">
                    <span className="font-semibold text-white">Módulo 2: Finanças, Métricas & Demonstrações Financeiras</span>
                    <span className="font-mono text-[#00C2A8] font-bold">Página 4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111C31] rounded-xl border border-white/5">
                    <span className="font-semibold text-white">Módulo 3: Marketing, Vendas, Growth & Modelos de Negócio</span>
                    <span className="font-mono text-[#00C2A8] font-bold">Página 5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111C31] rounded-xl border border-white/5">
                    <span className="font-semibold text-white">Módulo 4: Tecnologia, Operações, Engenharia & Métodos Ágeis</span>
                    <span className="font-mono text-[#00C2A8] font-bold">Página 6</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111C31] rounded-xl border border-white/5">
                    <span className="font-semibold text-white">Módulo 5: Recursos Humanos, Pessoas, Cultura & Liderança</span>
                    <span className="font-mono text-[#00C2A8] font-bold">Página 7</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111C31] rounded-xl border border-white/5">
                    <span className="font-semibold text-white">Módulo 6: O Plano de Ação de 7 Dias & Etiqueta de Comunicação</span>
                    <span className="font-mono text-[#00C2A8] font-bold">Página 8</span>
                  </div>
                </div>
              </div>

              {/* The 3-Step Accelerated Learning Method */}
              <div className="bg-[#111C31] border border-[#00C2A8]/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 text-[#00C2A8]">
                  <GraduationCap className="w-5 h-5" />
                  <h3 className="font-extrabold text-base text-white">
                    O Método em 3 Passos para Memorização Rápida
                  </h3>
                </div>
                <p className="text-xs text-[#B6C2D0] leading-relaxed">
                  A maioria das pessoas falha ao tentar memorizar termos corporativos decorando apenas a tradução em inglês. O método prático funciona através de 3 pilares de contexto:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 bg-[#07111F] rounded-xl border border-white/5 space-y-1.5">
                    <span className="text-xs font-extrabold text-[#00C2A8] block">Passo 1: Conceito Direto</span>
                    <p className="text-[11px] text-[#B6C2D0]">Entenda a utilidade prática em 1 frase (para que serve de verdade), sem jargões contábeis complexos.</p>
                  </div>
                  <div className="p-3.5 bg-[#07111F] rounded-xl border border-white/5 space-y-1.5">
                    <span className="text-xs font-extrabold text-[#00E5FF] block">Passo 2: Contexto de Reunião</span>
                    <p className="text-[11px] text-[#B6C2D0]">Associe a sigla ao momento em que ela é falada pelo diretor ou gerente (ex: apresentação de resultados).</p>
                  </div>
                  <div className="p-3.5 bg-[#07111F] rounded-xl border border-white/5 space-y-1.5">
                    <span className="text-xs font-extrabold text-[#38BDF8] block">Passo 3: Macete do Atalho</span>
                    <p className="text-[11px] text-[#B6C2D0]">Ancore a sigla a uma analogia simples do cotidiano para que o cérebro recupere a resposta instantaneamente.</p>
                  </div>
                </div>
              </div>

              {/* Golden Rule Callout */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-start space-x-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-emerald-200 leading-relaxed">
                  <strong className="text-white">Regra de Ouro em Reuniões:</strong> Nunca finja ter entendido uma sigla se ela for crítica para o seu projeto. Com este e-book aberto no celular ou computador, você consulta a sigla discretamente em 3 segundos sem interromper a apresentação.
                </p>
              </div>

            </div>

            {/* Page Footer */}
            <div className="pt-4 border-t border-white/10 flex justify-between text-xs text-[#7C8AA5]">
              <span>Dicionário Corporativo • Guia A4</span>
              <span className="font-mono">Página 2 / {totalPages}</span>
            </div>
          </div>
        )}

        {/* ================= PAGES 3 to 7: MODULES OF ACRONYMS ================= */}
        {[
          { pageNum: 3, catTitle: "Alta Gestão & Estratégia", catKey: "Alta Gestão", icon: Building2, desc: "Siglas essenciais usadas por diretores, gerentes executivos e conselhos fiscais." },
          { pageNum: 4, catTitle: "Finanças, Métricas & P&L", catKey: "Finanças & Métricas", icon: DollarSign, desc: "Métricas de lucratividade, retorno sobre investimento e análise de custos operacionais." },
          { pageNum: 5, catTitle: "Marketing, Vendas & Growth", catKey: "Marketing & Growth", icon: TrendingUp, desc: "Aceleração comercial, aquisição de clientes e modelos de negócio B2B/B2C." },
          { pageNum: 6, catTitle: "Tecnologia & Operações", catKey: "Tecnologia & Operações", icon: Cpu, desc: "Desenvolvimento ágil, infraestrutura na nuvem e integração de sistemas." },
          { pageNum: 7, catTitle: "Recursos Humanos & Pessoas", catKey: "RH & Pessoas", icon: Users, desc: "Gestão de talentos, plano de desenvolvimento e pesquisa de clima organizacional." }
        ].map((module) => {
          if (viewMode === "reader" && currentPage !== module.pageNum) return null;

          const moduleTerms = EBOOK_TERMS.filter(t => t.categoria === module.catKey);
          const IconComp = module.icon;

          return (
            <div
              key={module.pageNum}
              className="a4-sheet bg-[#0B1727] text-white p-8 sm:p-10 rounded-2xl border border-white/10 shadow-2xl relative min-h-[1050px] aspect-[1/1.414] flex flex-col justify-between print:shadow-none print:border-none print:rounded-none print:p-8 print:m-0 print:w-full print:h-screen print:page-break-after-always"
            >
              {/* Module Header */}
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-[#00C2A8] uppercase tracking-wider flex items-center space-x-1.5">
                    <IconComp className="w-4 h-4" />
                    <span>Módulo {module.pageNum - 2}: {module.catTitle}</span>
                  </span>
                  <span className="text-xs font-mono text-[#7C8AA5]">Página {module.pageNum}</span>
                </div>

                <p className="text-xs text-[#B6C2D0] mt-2 mb-4 italic">
                  {module.desc}
                </p>

                {/* List of Acronyms */}
                <div className="space-y-4">
                  {moduleTerms.map((term) => (
                    <div
                      key={term.sigla}
                      className="bg-[#111C31] border border-white/10 rounded-xl p-4 space-y-2.5 transition-all hover:border-[#00C2A8]/50"
                    >
                      <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-black text-[#00C2A8] tracking-tight">{term.sigla}</span>
                          <span className="text-[10px] text-white/80 font-semibold bg-white/5 px-2 py-0.5 rounded">
                            {term.nomeIngles}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#00E5FF] font-medium hidden sm:inline">
                          🇧🇷 {term.nomePortugues}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-white leading-relaxed">
                        {term.explicacaoCurta}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-[#07111F] p-2.5 rounded-lg border border-white/5">
                          <span className="text-[10px] font-bold text-[#7C8AA5] uppercase block mb-0.5">📌 Quando Usar:</span>
                          <p className="text-[#B6C2D0] leading-snug">{term.contextoReuniao}</p>
                        </div>
                        <div className="bg-[#07111F] p-2.5 rounded-lg border border-white/5">
                          <span className="text-[10px] font-bold text-[#00C2A8] uppercase block mb-0.5">💬 Exemplo Prático:</span>
                          <p className="text-white italic leading-snug">"{term.exemploReal}"</p>
                        </div>
                      </div>

                      <div className="text-[11px] bg-[#00C2A8]/10 text-[#00C2A8] p-2 rounded-lg font-medium border border-[#00C2A8]/20 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Macete de Memorização:</strong> {term.maceteMemorizacao}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-between text-xs text-[#7C8AA5] mt-auto">
                <span>Acelerador de Siglas Corporativas</span>
                <span className="font-mono">Página {module.pageNum} / {totalPages}</span>
              </div>
            </div>
          );
        })}

        {/* ================= PAGE 8: PLANO DE AÇÃO & CHECKLIST ================= */}
        {(viewMode === "grid" || currentPage === 8) && (
          <div className="a4-sheet bg-[#0B1727] text-white p-8 sm:p-12 rounded-2xl border border-white/10 shadow-2xl relative min-h-[1050px] aspect-[1/1.414] flex flex-col justify-between print:shadow-none print:border-none print:rounded-none print:p-8 print:m-0 print:w-full print:h-screen print:page-break-after-always">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold text-[#00C2A8] uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-4 h-4" />
                <span>Módulo 6: Plano de Ação em 7 Dias & Conclusão</span>
              </span>
              <span className="text-xs font-mono text-[#7C8AA5]">Página 8</span>
            </div>

            {/* Content */}
            <div className="my-auto space-y-6 py-4">
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">
                  O Desafio de 7 Dias para Domínio Absoluto
                </h2>
                <p className="text-xs text-[#B6C2D0] leading-relaxed">
                  Acelerar seu aprendizado exige colocar a linguagem em prática. Siga este roteiro simples durante os próximos 7 dias úteis:
                </p>
              </div>

              {/* 7 Day Checklist */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[#111C31] rounded-xl border border-white/5 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#00C2A8]/20 text-[#00C2A8] font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Dia 1 & 2: Mapeie as 5 Siglas Principais do seu Setor</h4>
                    <p className="text-[#B6C2D0] text-[11px] mt-0.5">Identifique quais siglas sua liderança direta mais repete em e-mails e apresentações. Anote-as na busca deste e-book.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#111C31] rounded-xl border border-white/5 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Dia 3 & 4: Use 1 Sigla Corretamente em uma Mensagem</h4>
                    <p className="text-[#B6C2D0] text-[11px] mt-0.5">Em vez de escrever 'Lucro da operação', use 'EBITDA'. Em vez de 'Acordo de entrega', use 'SLA'. Observe a reação positiva da equipe.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#111C31] rounded-xl border border-white/5 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Dia 5 a 7: Mantenha este Guia de Consulta Aberto</h4>
                    <p className="text-[#B6C2D0] text-[11px] mt-0.5">Durante suas reuniões do Zoom, Teams ou presenciais, mantenha a aba deste dicionário aberta no computador para buscas em 3 segundos.</p>
                  </div>
                </div>
              </div>

              {/* Communication Etiquette Box */}
              <div className="bg-[#111C31] p-5 rounded-2xl border border-[#00C2A8]/30 space-y-3">
                <h4 className="text-xs font-extrabold text-[#00C2A8] uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00C2A8]" />
                  <span>Boas Práticas de Etiqueta Corporativa:</span>
                </h4>
                <ul className="text-xs text-[#B6C2D0] space-y-2 list-disc list-inside">
                  <li><strong>Seja claro:</strong> Ao usar uma sigla incomum pela primeira vez em uma apresentação, explique o termo brevemente.</li>
                  <li><strong>Contexto é tudo:</strong> Evite exagerar no acúmulo de siglas desnecessárias para não tornar sua comunicação cansativa.</li>
                  <li><strong>Acesse a versão online:</strong> O portal online do Dicionário Corporativo é atualizado diariamente com novos termos do mercado.</li>
                </ul>
              </div>

              {/* Final Motivational Note */}
              <div className="p-4 bg-gradient-to-r from-[#00C2A8]/20 to-[#00E5FF]/20 border border-[#00C2A8]/40 rounded-xl text-center space-y-1">
                <h4 className="text-sm font-extrabold text-white">Você Concluiu o Guia de Aceleração!</h4>
                <p className="text-xs text-[#B6C2D0]">
                  Salve este arquivo em PDF no seu dispositivo ou acesse online sempre que precisar tirar dúvidas rápidas.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex justify-between text-xs text-[#7C8AA5]">
              <span>Dicionário Corporativo Brasil • Fim do Guia</span>
              <span className="font-mono">Página 8 / {totalPages}</span>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Floating Navigation for Reader Mode (Mobile & Desktop) */}
      {viewMode === "reader" && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#0B1727]/95 backdrop-blur-md border border-[#00C2A8]/40 px-5 py-2.5 rounded-full shadow-2xl flex items-center space-x-4 print:hidden">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-1.5 bg-[#111C31] text-white rounded-full hover:bg-[#00C2A8] hover:text-[#07111F] transition-all disabled:opacity-30 disabled:hover:bg-[#111C31] disabled:hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center font-mono text-xs">
            <span className="font-extrabold text-[#00C2A8]">Pág. {currentPage}</span>
            <span className="text-[#7C8AA5]"> de {totalPages}</span>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 bg-[#111C31] text-white rounded-full hover:bg-[#00C2A8] hover:text-[#07111F] transition-all disabled:opacity-30 disabled:hover:bg-[#111C31] disabled:hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
