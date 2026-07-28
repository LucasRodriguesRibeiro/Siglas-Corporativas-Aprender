import React, { useState } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Search, 
  ArrowRight, 
  HelpCircle, 
  Star, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Lock,
  Clock,
  Award,
  ArrowLeft,
  CreditCard,
  QrCode,
  Flame,
  Check,
  Brain,
  AlertCircle,
  MessageSquare,
  Bookmark,
  Copy,
  X,
  Filter
} from "lucide-react";

interface SalesPageProps {
  onBackToLogin: () => void;
}

const HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/R106890432S?bid=1785171780452";

const SAMPLE_TERMS = [
  {
    sigla: "EBITDA",
    nome: "Earnings Before Interest, Taxes, Depreciation, and Amortization",
    traducao: "Lucros Antes de Juros, Impostos, Depreciação e Amortização",
    categoria: "Finanças",
    resumo: "Mede a eficiência operacional da empresa desconsiderando juros, impostos e depreciação.",
    exemplo: "O nosso EBITDA cresceu 15% no último trimestre devido ao corte de custos operacionais."
  },
  {
    sigla: "OKR",
    nome: "Objectives and Key Results",
    traducao: "Objetivos e Resultados-Chave",
    categoria: "Gestão",
    resumo: "Metodologia de gestão de metas focada em alinhar objetivos ambiciosos com resultados mensuráveis.",
    exemplo: "Nosso principal OKR para este semestre é reduzir o tempo de atendimento ao cliente."
  },
  {
    sigla: "SLA",
    nome: "Service Level Agreement",
    traducao: "Acordo de Nível de Serviço",
    categoria: "Operações",
    resumo: "Compromisso formal que especifica o tempo limite e a qualidade exigida de entrega de um serviço.",
    exemplo: "O SLA do suporte técnico para chamados urgentes é de no máximo 2 horas."
  },
  {
    sigla: "MoM",
    nome: "Month over Month",
    traducao: "Mês a Mês",
    categoria: "Vendas",
    resumo: "Métrica comparativa do desempenho do mês atual em relação ao mês imediatamente anterior.",
    exemplo: "Tivemos um aumento de 22% MoM no número de novos clientes cadastrados."
  },
  {
    sigla: "CAC",
    nome: "Customer Acquisition Cost",
    traducao: "Custo de Aquisição de Cliente",
    categoria: "Marketing",
    resumo: "Valor total investido em marketing e vendas para conseguir atrair um novo cliente.",
    exemplo: "Otimizamos nossas campanhas digitais e reduzimos o CAC de R$ 120 para R$ 75."
  },
  {
    sigla: "ROI",
    nome: "Return on Investment",
    traducao: "Retorno sobre o Investimento",
    categoria: "Finanças",
    resumo: "Métrica que calcula o ganho ou perda financeira obtida em relação ao capital investido.",
    exemplo: "O ROI da nova ferramenta de automação superou 300% no primeiro ano."
  }
];

const FAQS = [
  {
    q: "Como recebo meu usuário e senha de acesso?",
    a: "Assim que o pagamento for confirmado no Hotmart, você receberá instantaneamente um e-mail com seus dados de login e instruções para acessar a plataforma."
  },
  {
    q: "Por quanto tempo terei acesso ao dicionário?",
    a: "O acesso é vitalício! Você paga uma única vez (R$ 67,00) e pode consultar todas as siglas e novos termos sempre que precisar, sem taxas recorrentes."
  },
  {
    q: "Funciona perfeitamente no celular?",
    a: "Sim! A plataforma foi desenvolvida com foco total em usabilidade mobile. Você pode buscar qualquer sigla rapidamente durante uma reunião direto do seu smartphone."
  },
  {
    q: "Quais são as formas de pagamento aceitas?",
    a: "Aceitamos PIX com liberação imediata, Cartão de Crédito em até 12x, Cartão Virtual Caixa e Boleto Bancário via ambiente 100% seguro Hotmart."
  },
  {
    q: "E se eu não gostar do produto?",
    a: "Oferecemos Garantia Incondicional de 7 Dias. Se você achar que o dicionário não te ajudou em nada, basta solicitar o reembolso na Hotmart com 1 clique."
  }
];

export default function SalesPage({ onBackToLogin }: SalesPageProps) {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Live demo app states
  const [demoSearch, setDemoSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [demoFavorite, setDemoFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter terms according to search or category
  const filteredTerms = SAMPLE_TERMS.filter((term) => {
    const matchesSearch = 
      demoSearch.trim() === "" ||
      term.sigla.toLowerCase().includes(demoSearch.toLowerCase()) ||
      term.nome.toLowerCase().includes(demoSearch.toLowerCase()) ||
      term.traducao.toLowerCase().includes(demoSearch.toLowerCase()) ||
      term.categoria.toLowerCase().includes(demoSearch.toLowerCase());

    const matchesCategory = selectedCategory === "Todas" || term.categoria.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const selectedTerm = filteredTerms[activeSampleIndex] || filteredTerms[0] || SAMPLE_TERMS[0];

  return (
    <div className="min-h-screen bg-[#07111F] text-white flex flex-col font-sans selection:bg-[#00C2A8] selection:text-[#07111F] pb-24 sm:pb-0">


      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[200px] sm:h-[350px] bg-[#00C2A8]/15 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-[#111C31] border border-[#00C2A8]/30 rounded-full text-[11px] sm:text-xs font-semibold text-[#00C2A8] shadow-sm">
            <Award className="w-3.5 h-3.5 text-[#00C2A8] shrink-0" />
            <span className="truncate">O Guia Nº1 de Termos Corporativos no Brasil</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-5xl leading-snug sm:leading-tight text-white tracking-tight px-1">
            Nunca Mais Fique Perdido em Reuniões com <span className="bg-gradient-to-r from-[#00C2A8] via-[#00E5FF] to-[#38BDF8] bg-clip-text text-transparent underline decoration-[#00C2A8]/40">Siglas Corporativas</span> Que Você Não Conhece!
          </h1>

          <p className="text-xs sm:text-base text-[#B6C2D0] max-w-2xl mx-auto leading-relaxed px-2">
            Consulte o significado de qualquer sigla em <strong className="text-[#00C2A8] font-bold">menos de 3 segundos</strong> direto no seu celular ou computador durante a reunião e entenda termos como EBITDA, OKR, SLA, B2B e ROI sem hesitar.
          </p>
        </div>

        {/* Realistic Interactive App Preview Container */}
        <div className="mt-8 sm:mt-12 max-w-2xl mx-auto bg-[#0B1727] border border-[#00C2A8]/40 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-[#00C2A8]/15 space-y-4 text-left relative z-10">
          
          {/* App Window Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              <span className="text-[11px] text-[#7C8AA5] font-mono ml-2 hidden sm:inline">dicionariocorporativo.app</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 text-[10px] text-[#00C2A8] font-bold bg-[#00C2A8]/10 border border-[#00C2A8]/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#00C2A8]" />
                <span>Demonstração ao Vivo</span>
              </span>
            </div>
          </div>

          {/* Realistic App Title Bar */}
          <div className="flex items-center justify-between bg-[#111C31] p-3 rounded-xl border border-white/5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00C2A8]/20 border border-[#00C2A8]/40 flex items-center justify-center text-[#00C2A8]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Dicionário Corporativo</h4>
                <p className="text-[10px] text-[#7C8AA5]">500+ Siglas & Termos Cadastrados</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
              ● Sistema Ativo
            </span>
          </div>

          {/* Interactive Search Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#00C2A8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={demoSearch}
                onChange={(e) => {
                  setDemoSearch(e.target.value);
                  setActiveSampleIndex(0);
                }}
                placeholder="Busque por qualquer sigla (ex: EBITDA, OKR, ROI, CAC)..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#111C31] border border-[#00C2A8]/30 rounded-xl text-xs text-white placeholder-[#7C8AA5] focus:outline-none focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8] transition-all"
              />
              {demoSearch && (
                <button
                  onClick={() => setDemoSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8AA5] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-[#7C8AA5] font-medium text-[10px] shrink-0 flex items-center mr-1">
                <Filter className="w-3 h-3 mr-1 text-[#00C2A8]" />
                Filtrar:
              </span>
              {["Todas", "Finanças", "Gestão", "Marketing", "Vendas", "Operações"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setActiveSampleIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                    selectedCategory === cat
                      ? "bg-[#00C2A8] text-[#07111F] font-bold shadow-md shadow-[#00C2A8]/20"
                      : "bg-[#111C31] text-[#B6C2D0] hover:text-white border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Fast Suggestion Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-[#7C8AA5]">Clique para testar:</span>
              {SAMPLE_TERMS.slice(0, 4).map((term) => (
                <button
                  key={term.sigla}
                  onClick={() => {
                    setDemoSearch(term.sigla);
                    setActiveSampleIndex(0);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                    selectedTerm?.sigla === term.sigla
                      ? "bg-[#00C2A8]/20 text-[#00C2A8] border border-[#00C2A8]/50"
                      : "bg-[#111C31] text-[#7C8AA5] hover:text-white border border-white/5"
                  }`}
                >
                  {term.sigla}
                </button>
              ))}
            </div>
          </div>

          {/* Live Result Card (Faithful to Real App SiglaCard) */}
          {selectedTerm ? (
            <div className="bg-[#111C31] border border-[#00C2A8]/30 rounded-xl p-4 sm:p-5 space-y-3 transition-all relative overflow-hidden shadow-lg">
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl sm:text-2xl font-black text-[#00C2A8] tracking-tight">
                      {selectedTerm.sigla}
                    </span>
                    <span className="text-[10px] bg-[#00C2A8]/10 text-[#00C2A8] border border-[#00C2A8]/30 px-2.5 py-0.5 rounded-full font-bold">
                      {selectedTerm.categoria}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-white leading-snug">
                    {selectedTerm.nome}
                  </h5>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => setDemoFavorite(!demoFavorite)}
                    title="Favoritar"
                    className={`p-1.5 rounded-lg border transition-all ${
                      demoFavorite 
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40" 
                        : "bg-[#0B1727] text-[#7C8AA5] hover:text-white border-white/10"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${demoFavorite ? "fill-amber-400" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleCopy(`${selectedTerm.sigla}: ${selectedTerm.resumo}`)}
                    title="Copiar explicação"
                    className="p-1.5 bg-[#0B1727] text-[#7C8AA5] hover:text-white border border-white/10 rounded-lg transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Portuguese Translation */}
              <div className="text-xs text-[#00E5FF] font-medium flex items-center space-x-1.5 bg-[#07111F]/60 px-3 py-1.5 rounded-lg border border-white/5">
                <span>🇧🇷 Tradução:</span>
                <span className="text-white font-semibold">{selectedTerm.traducao}</span>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7C8AA5] uppercase tracking-wider block">O que significa:</span>
                <p className="text-xs text-[#B6C2D0] leading-relaxed">
                  {selectedTerm.resumo}
                </p>
              </div>

              {/* Workplace Example */}
              <div className="p-3 bg-[#07111F] rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-[#00C2A8] uppercase tracking-wider block">Exemplo real em reunião:</span>
                <p className="text-xs text-white italic leading-relaxed">
                  "{selectedTerm.exemplo}"
                </p>
              </div>

              {/* Speed & Verification Tag */}
              <div className="flex items-center justify-between text-[10px] text-[#7C8AA5] pt-1 border-t border-white/5">
                <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                  <Zap className="w-3 h-3" />
                  <span>Resultado retornado em 0.1s</span>
                </span>
                <span className="text-[#00C2A8] font-semibold">✓ Verificado no Dicionário</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#7C8AA5] bg-[#111C31] rounded-xl border border-white/5">
              Nenhuma sigla encontrada para "{demoSearch}". Tente buscar por EBITDA, OKR, ROI ou SLA.
            </div>
          )}

        </div>
      </section>

      {/* Problem & Solution Grid */}
      <section className="py-10 sm:py-14 px-4 bg-[#0B1727]/60 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              Você já passou por alguma destas situações?
            </h2>
            <p className="text-xs sm:text-sm text-[#B6C2D0]">
              O vocabulário corporativo moderno não precisa ser uma barreira no seu crescimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#111C31] border border-white/10 hover:border-[#00C2A8]/30 transition-all rounded-2xl p-5 sm:p-6 space-y-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm sm:text-lg">
                1
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">Insegurança em Reuniões</h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Aquele momento em que o gestor fala sobre "OKRs, MoM e SLA" e você concorda sem entender o significado real.
              </p>
            </div>

            <div className="bg-[#111C31] border border-white/10 hover:border-[#00C2A8]/30 transition-all rounded-2xl p-5 sm:p-6 space-y-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm sm:text-lg">
                2
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">E-mails e Relatórios Confusos</h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Receber e-mails cheios de termos em inglês e perder tempo buscando explicações superficiais na internet.
              </p>
            </div>

            <div className="bg-[#111C31] border border-white/10 hover:border-[#00C2A8]/30 transition-all rounded-2xl p-5 sm:p-6 space-y-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#00C2A8]/10 border border-[#00C2A8]/20 text-[#00C2A8] flex items-center justify-center font-bold text-sm sm:text-lg">
                3
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">Medo de Perguntar</h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Hesitar em perguntar no meio do projeto para não parecer desatualizado em relação aos colegas e diretores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mental Rumination & Inner Thoughts Section */}
      <section className="py-12 sm:py-16 px-4 bg-[#07111F] border-b border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#00C2A8]/10 border border-[#00C2A8]/20 rounded-full text-xs font-bold text-[#00C2A8]">
              <Brain className="w-4 h-4 text-[#00C2A8] shrink-0" />
              <span>Situações do Dia a Dia Corporativo</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Você Já Se Viu em Alguma Dessas Situações?
            </h2>
            <p className="text-xs sm:text-sm text-[#B6C2D0] leading-relaxed">
              Pensamentos e receios reais que quase todo profissional enfrenta em reuniões e conversas de trabalho:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0B1727] border border-amber-500/20 rounded-2xl p-4 sm:p-5 space-y-2 relative shadow-lg">
              <div className="flex items-center space-x-2 text-amber-400">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Apreensão em Reunião</span>
              </div>
              <p className="text-xs text-white font-medium italic leading-relaxed">
                "E se me fizerem uma pergunta direta sobre a métrica no meio da apresentação e eu gaguejar por não saber o significado da sigla?"
              </p>
            </div>

            <div className="bg-[#0B1727] border border-amber-500/20 rounded-2xl p-4 sm:p-5 space-y-2 relative shadow-lg">
              <div className="flex items-center space-x-2 text-amber-400">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Comparação Involuntária</span>
              </div>
              <p className="text-xs text-white font-medium italic leading-relaxed">
                "Todo mundo nessa chamada fala esse 'dialeto' corporativo com tanta facilidade... será que só eu não estou acompanhando?"
              </p>
            </div>

            <div className="bg-[#0B1727] border border-amber-500/20 rounded-2xl p-4 sm:p-5 space-y-2 relative shadow-lg">
              <div className="flex items-center space-x-2 text-amber-400">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Pesquisa Frustrante</span>
              </div>
              <p className="text-xs text-white font-medium italic leading-relaxed">
                "Fico anotando siglas escondido num bloco de notas pra pesquisar depois no Google, mas as explicações na internet são gigantes e teóricas demais."
              </p>
            </div>

            <div className="bg-[#0B1727] border border-amber-500/20 rounded-2xl p-4 sm:p-5 space-y-2 relative shadow-lg">
              <div className="flex items-center space-x-2 text-amber-400">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Insegurança Profissional</span>
              </div>
              <p className="text-xs text-white font-medium italic leading-relaxed">
                "Se eu perguntar o significado do EBITDA ou do SLA agora, vão achar que sou inexperiente ou que não estou preparado para o cargo."
              </p>
            </div>
          </div>

          {/* Solution Callout */}
          <div className="bg-gradient-to-r from-[#00C2A8]/10 via-[#111C31] to-[#00C2A8]/10 border border-[#00C2A8]/30 rounded-2xl p-5 text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-[#00C2A8]">
              <Sparkles className="w-5 h-5 text-[#00C2A8]" />
              <span className="font-extrabold text-sm text-white">Fale com Total Segurança e Autoridade em Qualquer Reunião</span>
            </div>
            <p className="text-xs sm:text-sm text-[#B6C2D0] max-w-2xl mx-auto leading-relaxed">
              A verdade é que ninguém nasce sabendo dezenas de siglas corporativas em inglês. Ter o <strong className="text-white">Dicionário Corporativo</strong> aberto no seu celular ou computador elimina essa dúvida em segundos e te devolve a total <strong className="text-[#00C2A8]">confiança e autoridade</strong> para falar de igual para igual com qualquer diretoria.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits Features */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold text-[#00C2A8] uppercase tracking-widest bg-[#00C2A8]/10 px-3 py-1 rounded-full border border-[#00C2A8]/20">
              A Solução Prática
            </span>
            <h2 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight">
              O Que Você Terá no Seu Dicionário Corporativo
            </h2>
            <p className="text-xs sm:text-sm text-[#B6C2D0]">
              Acesso rápido e prático no seu computador e celular para consultar a qualquer momento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 bg-[#0B1727] border border-white/10 rounded-2xl space-y-2.5 hover:border-[#00C2A8]/30 transition-all">
              <div className="p-2.5 bg-[#00C2A8]/10 text-[#00C2A8] w-fit rounded-xl border border-[#00C2A8]/20">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">Busca Instantânea Inteligente</h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Procure qualquer sigla ou palavra-chave e encontre a explicação completa em menos de 1 segundo.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-[#0B1727] border border-white/10 rounded-2xl space-y-2.5 hover:border-[#00C2A8]/30 transition-all">
              <div className="p-2.5 bg-[#00C2A8]/10 text-[#00C2A8] w-fit rounded-xl border border-[#00C2A8]/20">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">Tradução e Contexto em Inglês</h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Entenda o significado exato no ambiente corporativo internacional e termos de mercado multinacional.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-[#0B1727] border border-white/10 rounded-2xl space-y-2.5 hover:border-[#00C2A8]/30 transition-all">
              <div className="p-2.5 bg-[#00C2A8]/10 text-[#00C2A8] w-fit rounded-xl border border-[#00C2A8]/20">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">Exemplos Reais Práticos</h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Veja frases-modelo de como aplicar cada sigla no seu dia a dia profissional com naturalidade.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-[#0B1727] border border-white/10 rounded-2xl space-y-2.5 hover:border-[#00C2A8]/30 transition-all">
              <div className="p-2.5 bg-[#00C2A8]/10 text-[#00C2A8] w-fit rounded-xl border border-[#00C2A8]/20">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">Categorizado por Área</h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Filtre termos específicos por Finanças, Vendas, Tecnologia, RH, Executivo, Marketing e Operações.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-[#0B1727] border border-white/10 rounded-2xl space-y-2.5 hover:border-[#00C2A8]/30 transition-all">
              <div className="p-2.5 bg-[#00C2A8]/10 text-[#00C2A8] w-fit rounded-xl border border-[#00C2A8]/20">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">Acesso Vitalício sem Mensalidade</h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Pague uma única vez e tenha acesso para sempre a todas as futuras atualizações e novas siglas.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-[#0B1727] border border-white/10 rounded-2xl space-y-2.5 hover:border-[#00C2A8]/30 transition-all">
              <div className="p-2.5 bg-[#00C2A8]/10 text-[#00C2A8] w-fit rounded-xl border border-[#00C2A8]/20">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">100% Responsivo no Celular</h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Acesse do seu smartphone em qualquer lugar, durante reuniões, viagens ou no trabalho.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offer / Pricing Box */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-[#07111F] to-[#0B1727] border-t border-white/5" id="checkout">
        <div className="max-w-xl mx-auto bg-[#0B1727] border-2 border-[#00C2A8] rounded-3xl p-5 sm:p-10 shadow-2xl shadow-[#00C2A8]/15 space-y-6 sm:space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#00C2A8] text-[#07111F] text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-2xl flex items-center space-x-1 shadow-md">
            <Flame className="w-3 h-3 fill-[#07111F]" />
            <span>Oferta Especial</span>
          </div>

          <div className="text-center space-y-2 pt-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Licença Vitalícia de Acesso
            </h3>
            <p className="text-xs text-[#B6C2D0]">
              Garanta sua conta pessoal com liberação imediata
            </p>
          </div>

          <div className="space-y-2 text-center py-4 bg-[#111C31] rounded-2xl border border-white/10">
            <p className="text-xs text-[#7C8AA5] line-through">De R$ 197,00 por apenas</p>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-sm font-bold text-[#00C2A8]">R$</span>
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">67,00</span>
            </div>
            <p className="text-xs text-[#00C2A8] font-bold">
              Pagamento Único • Sem Mensalidades
            </p>
          </div>

          {/* Included Features checklist */}
          <div className="space-y-2.5 text-xs text-[#B6C2D0]">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8] shrink-0" />
              <span>Acesso liberado imediatamente no e-mail</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8] shrink-0" />
              <span>+100 siglas explicadas em Português e Inglês</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8] shrink-0" />
              <span>Exemplos de uso em reuniões e e-mails</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8] shrink-0" />
              <span>Busca rápida e filtros por área de negócio</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8] shrink-0" />
              <span>Garantia de satisfação de 7 dias</span>
            </div>
          </div>

          {/* Payment Methods Badge */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-center space-x-4 text-[11px] text-[#7C8AA5]">
            <span className="flex items-center space-x-1">
              <QrCode className="w-3.5 h-3.5 text-[#00C2A8]" />
              <span>PIX Imediato</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <CreditCard className="w-3.5 h-3.5 text-[#00C2A8]" />
              <span>Até 12x no Cartão</span>
            </span>
          </div>

          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#00C2A8] hover:bg-[#00e6c7] text-[#07111F] font-black text-sm sm:text-base rounded-2xl transition-all shadow-xl shadow-[#00C2A8]/20 flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>COMPRAR ACESSO AGORA - R$ 67,00</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </a>

          <p className="text-[11px] text-center text-[#7C8AA5] flex items-center justify-center space-x-1">
            <Lock className="w-3 h-3 text-[#00C2A8]" />
            <span>Compra 100% Segura e Criptografada via Hotmart</span>
          </p>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-12 sm:py-14 px-4 max-w-3xl mx-auto space-y-6 w-full">
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#00C2A8]" />
            <span>Perguntas Frequentes</span>
          </h3>
          <p className="text-xs text-[#B6C2D0]">Clique nas perguntas abaixo para ver as respostas</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="bg-[#0B1727] border border-white/10 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-white text-xs sm:text-sm flex items-center justify-between space-x-3 hover:bg-[#111C31]/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#00C2A8] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7C8AA5] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-[#B6C2D0] leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-8 px-4 text-center text-xs text-[#7C8AA5] space-y-3">
        <p>© {new Date().getFullYear()} Dicionário Corporativo. Todos os direitos reservados.</p>
        <div className="flex items-center justify-center space-x-4">
          <button onClick={onBackToLogin} className="hover:text-white transition-colors">
            Fazer Login
          </button>
          <span>•</span>
          <a 
            href="https://www.instagram.com/lucasribeirotrafego/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Suporte Instagram (@lucasribeirotrafego)
          </a>
        </div>
      </footer>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B1727]/95 backdrop-blur-lg border-t border-[#00C2A8]/30 p-3 sm:hidden shadow-2xl flex items-center justify-center">
        <a
          href={HOTMART_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 bg-[#00C2A8] hover:bg-[#00e6c7] text-[#07111F] font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-lg active:scale-95 transition-all text-center uppercase tracking-wide"
        >
          <span>QUERO GARANTIR MEU ACESSO AGORA</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </a>
      </div>
    </div>
  );
}

