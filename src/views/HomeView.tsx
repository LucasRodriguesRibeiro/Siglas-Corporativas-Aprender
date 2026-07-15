import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  TrendingUp, 
  Calendar, 
  HelpCircle, 
  Bookmark, 
  Share2, 
  ChevronRight, 
  Award, 
  Cpu, 
  BadgeCheck, 
  Send, 
  Sparkles, 
  CheckCircle,
  Clock,
  BookOpenText,
  BookmarkCheck,
  FileDown,
  Download,
  Briefcase,
  Users,
  DollarSign,
  Package,
  ShoppingCart
} from "lucide-react";
import { Sigla, BlogArticle, PortalStats } from "../types";
import AdsPlaceholder from "../components/AdsPlaceholder";
import { SiglaCardSkeleton } from "../components/Skeleton";

const CATEGORY_INTRO_TEXTS: Record<string, string> = {
  "Todas": "Seja bem-vindo ao maior portal de siglas corporativas do Brasil. Aqui você pode pesquisar, filtrar e aprender o significado de mais de 500 siglas e termos empresariais utilizados no mercado nacional e internacional. Navegue pelas nossas categorias, faça download do guia completo em PDF para estudar de forma offline, e domine os jargões e expressões mais influentes do mundo corporativo para alavancar a sua autoridade profissional.",
  "Marketing": "Se você trabalha com marketing digital, dominar as siglas corporativas é essencial para analisar o desempenho de campanhas e estratégias. Aprender siglas corporativas de marketing como CAC, LTV, CTR, ROI e CPA permite avaliar investimentos com precisão, estruturar relatórios dinâmicos de faturamento e se comunicar de forma clara com a diretoria.",
  "Recursos Humanos": "O setor de Recursos Humanos (RH) utiliza um conjunto específico de siglas corporativas para lidar com contratação, benefícios, legislação trabalhista e desenvolvimento de talentos. Nosso dicionário de siglas corporativas de RH ensina tudo sobre CLT, PJ, EVP, PDI, ATS e feedbacks 360, amparando profissionais e gestores de pessoas.",
  "Financeiro": "A linguagem de siglas corporativas financeiras é repleta de jargões que medem a rentabilidade e a saúde contábil de uma empresa. Compreender e aprender siglas corporativas financeiras como EBITDA, ROI, DRE, CAGR, CAPEX e OPEX é indispensável para apresentações de negócios, planejamento de orçamentos e tomada de decisões estratégicas de alto nível.",
  "Tecnologia": "A área de tecnologia da informação (TI) e desenvolvimento de softwares está repleta de termos técnicos e siglas corporativas fundamentais. Estudar siglas corporativas de tecnologia como API, SaaS, BI, UX, UI, CTO e IA ajuda na colaboração entre equipes técnicas e de negócios, impulsionando a eficiência dos processos organizacionais.",
  "Vendas": "No setor de vendas e comercial, as siglas corporativas são utilizadas para acompanhar o funil de vendas, a performance dos vendedores e o relacionamento com o cliente. Aprender siglas corporativas de vendas como CRM, SQL, MQL, SDR e LTV ajuda a estruturar processos comerciais previsíveis e fechar mais negócios.",
  "Logística": "A logística corporativa depende de metodologias rápidas e eficientes para a cadeia de suprimentos e transporte. Aprender siglas corporativas de logística como SLA, SKU, 3PL, WMS, FIFO e ERP é essencial para a governança operacional e o sucesso da distribuição física empresarial.",
  "Gestão": "A gestão empresarial moderna envolve metodologias ágeis e planejamento estratégico baseado em metas de alto desempenho. Conhecer siglas corporativas de gestão como OKR, KPI, CEO, CFO, COO e PMO garante alinhamento estratégico, foco na produtividade contínua e liderança eficiente nas empresas."
};

interface HomeViewProps {
  navigate: (to: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
}

export default function HomeView({
  navigate,
  favorites,
  toggleFavorite,
  selectedCategory,
  setSelectedCategory,
  showFavorites,
  setShowFavorites
}: HomeViewProps) {
  // Database States
  const [siglas, setSiglas] = useState<Sigla[]>([]);
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("az"); // az, za, popular, recente
  const [isFocused, setIsFocused] = useState(false);

  // Community Contribution States
  const [contribSigla, setContribSigla] = useState("");
  const [contribCategory, setContribCategory] = useState("Gestão");
  const [contribNomeCompleto, setContribNomeCompleto] = useState("");
  const [contribDescricaoCurta, setContribDescricaoCurta] = useState("");
  const [contribSubmitting, setContribSubmitting] = useState(false);
  const [contribSuccess, setContribSuccess] = useState(false);
  const [contribError, setContribError] = useState("");

  // Categories list
  const categories = [
    "Todas", "Marketing", "Vendas", "Tecnologia", "Recursos Humanos", 
    "Financeiro", "Contabilidade", "Jurídico", "Saúde", "Logística", 
    "Gestão", "Projetos", "Administrativo", "Comercial", "Engenharia", "Compras"
  ];

  // Alphabet A-Z List
  const alphabet = ["Todas", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

  // Featured Categories with custom descriptions and icons
  const featuredCategoriesList = [
    {
      name: "Gestão",
      icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
      desc: "Metodologias de liderança, planejamento estratégico e frameworks de metas corporativas.",
      examples: "OKR, KPI, CEO, CFO, COO"
    },
    {
      name: "Marketing",
      icon: <TrendingUp className="w-6 h-6 text-teal-500" />,
      desc: "Métricas de atração, conversão de campanhas e análise de audiência digital e de branding.",
      examples: "CAC, LTV, CTR, ROI, CPA"
    },
    {
      name: "Tecnologia",
      icon: <Cpu className="w-6 h-6 text-blue-500" />,
      desc: "Infraestrutura de nuvem, desenvolvimento de software, governança de TI e inteligência artificial.",
      examples: "API, SaaS, BI, UX, UI, CTO"
    },
    {
      name: "Vendas",
      icon: <ShoppingCart className="w-6 h-6 text-amber-500" />,
      desc: "Processos comerciais, acompanhamento de funil de vendas, prospecção e fechamentos de negócios.",
      examples: "CRM, SQL, MQL, SDR, LTV"
    },
    {
      name: "Financeiro",
      icon: <DollarSign className="w-6 h-6 text-emerald-500" />,
      desc: "Análise de fluxo de caixa, indicadores de rentabilidade e demonstrações contábeis.",
      examples: "EBITDA, ROI, DRE, CAGR, CAPEX"
    },
    {
      name: "Recursos Humanos",
      icon: <Award className="w-6 h-6 text-rose-500" />,
      desc: "Regimes de contratação, bem-estar, recrutamento e desenvolvimento contínuo de pessoas.",
      examples: "CLT, PJ, EVP, PDI, ATS"
    },
    {
      name: "Logística",
      icon: <Package className="w-6 h-6 text-orange-500" />,
      desc: "Cadeia de suprimentos, estocagem, prazos de entrega e inteligência operacional.",
      examples: "SLA, SKU, 3PL, WMS, FIFO"
    }
  ];

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load stats
        const statsRes = await fetch("/api/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Load blog articles
        const blogRes = await fetch("/api/blog");
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setRecentPosts(blogData.slice(0, 3));
        }

        // Load all siglas for client-side search indexing
        const siglasRes = await fetch("/api/siglas");
        if (siglasRes.ok) {
          const siglasData = await siglasRes.json();
          setSiglas(siglasData);
        }
      } catch (err) {
        console.error("Erro ao carregar dados da Home:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter and sort the acronyms client-side for dynamic speed (Lighthouse performance)
  const filteredSiglas = siglas.filter((item) => {
    // 1. Favorite filter
    if (showFavorites && !favorites.includes(item.id)) {
      return false;
    }

    // 2. Category filter
    if (selectedCategory !== "Todas" && item.categoria.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // 3. Letter filter
    if (selectedLetter !== "Todas" && !item.sigla.toUpperCase().startsWith(selectedLetter)) {
      return false;
    }

    // 4. Search Query filter (matches sigla, nome, descricao, tags)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.sigla.toLowerCase().includes(q) ||
        item.nome_completo.toLowerCase().includes(q) ||
        item.descricao_curta.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return true;
  });

  // Sort acronyms based on state
  const sortedSiglas = [...filteredSiglas].sort((a, b) => {
    if (sortOrder === "az") {
      return a.sigla.localeCompare(b.sigla);
    }
    if (sortOrder === "za") {
      return b.sigla.localeCompare(a.sigla);
    }
    if (sortOrder === "popular") {
      return b.popularidade - a.popularidade;
    }
    if (sortOrder === "recente") {
      return b.id.localeCompare(a.id);
    }
    return 0;
  });

  // Autocomplete Suggestions (top 5 matched while typing)
  const autocompleteSuggestions = searchQuery.trim() !== "" 
    ? siglas.filter(item => 
        item.sigla.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        item.nome_completo.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const showCategoryGrid = selectedCategory === "Todas" && searchQuery.trim() === "" && selectedLetter === "Todas" && !showFavorites;

  // Submit community suggestion
  async function handleContribSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contribSigla.trim()) {
      setContribError("Por favor, digite a sigla.");
      return;
    }
    if (!contribNomeCompleto.trim()) {
      setContribError("Por favor, digite o significado/nome completo.");
      return;
    }
    if (!contribDescricaoCurta.trim()) {
      setContribError("Por favor, digite uma descrição curta.");
      return;
    }

    const payload = {
      sigla: contribSigla.toUpperCase().trim(),
      nome_completo: contribNomeCompleto.trim(),
      descricao_curta: contribDescricaoCurta.trim(),
      categoria: contribCategory,
      tags: [contribCategory.toLowerCase(), "contribuição"]
    };

    try {
      setContribSubmitting(true);
      setContribError("");
      const res = await fetch("/api/siglas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao salvar a sugestão.");
      }

      const savedSigla = await res.json();
      // Add to local list so it renders immediately
      setSiglas([savedSigla, ...siglas]);
      setContribSuccess(true);
      setContribSigla("");
      setContribNomeCompleto("");
      setContribDescricaoCurta("");
      
      // Update stats
      if (stats) {
        setStats({ ...stats, totalSiglas: stats.totalSiglas + 1 });
      }

      setTimeout(() => setContribSuccess(false), 5000);
    } catch (err: any) {
      setContribError(err.message || "Erro ao enviar contribuição.");
    } finally {
      setContribSubmitting(false);
    }
  }

  return (
    <div className="space-y-12 pb-16 bg-[#07111F]">
      {/* 1. Hero Search Area */}
      <section className="relative pt-12 sm:pt-20 pb-8 sm:pb-12 bg-[#07111F] transition-all duration-250">
        <div className="px-5 min-[360px]:px-6 md:px-8 xl:px-8 max-w-[1280px] mx-auto w-full text-center">
          <div className="pt-6 sm:pt-10 pb-4">
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-tight">
              Siglas Corporativas
            </h1>
            <p className="text-base sm:text-lg text-[#B6C2D0] font-medium max-w-3xl mx-auto leading-relaxed mt-6 sm:mt-8">
              Aprenda rapidamente o significado das principais siglas utilizadas por empresas, profissionais e estudantes.
            </p>
          </div>

          {/* Premium Search Box - mt-10 is exactly 40px (Hero -> Search: 40px) */}
          <div className="relative max-w-2xl mx-auto mt-10" id="search-box-container">
            <div className="relative flex items-center h-[60px] bg-[#111C31] hover:bg-[#162540] border border-white/[0.08] rounded-[18px] shadow-lg focus-within:ring-2 focus-within:ring-[#00C2A8]/30 focus-within:border-[#00C2A8] transition-all duration-250 overflow-hidden">
              <div className="pl-4 text-[#7C8AA5]">
                <Search className="w-5.5 h-5.5 text-[#00C2A8]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Pesquisar sigla, significado, área ou tag... (ex: OKR, ROI)"
                className="w-full py-4 px-3 text-white bg-transparent placeholder-[#7C8AA5] outline-none text-base font-normal"
                id="main-search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="pr-4 text-xs font-semibold text-[#7C8AA5] hover:text-white transition-colors duration-250"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown overlay */}
            {isFocused && autocompleteSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#111C31] border border-white/[0.08] rounded-[18px] shadow-2xl z-50 text-left overflow-hidden divide-y divide-white/[0.06]">
                {autocompleteSuggestions.map((item) => (
                  <div
                    key={item.id}
                    onMouseDown={() => navigate(`/sigla/${item.slug}`)}
                    className="p-4 hover:bg-[#162540] cursor-pointer flex items-center justify-between transition-colors duration-250"
                  >
                    <div>
                      <span className="font-display font-extrabold text-[#00C2A8] text-lg mr-3">
                        {item.sigla}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {item.nome_completo}
                      </span>
                    </div>
                    <span className="text-xs text-[#B6C2D0] font-mono bg-[#0D1628] border border-white/[0.05] px-2 py-0.5 rounded-md">
                      {item.categoria}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statistics counter card - mt-12 is exactly 48px (Search -> Stats: 48px) */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 max-w-3xl mx-auto mt-12 pt-10 border-t border-white/[0.06] text-center">
              <div className="p-5 sm:p-6 bg-[#111C31] hover:bg-[#162540] border border-white/[0.08] rounded-[20px] transition-all duration-250 scale-100 hover:scale-102">
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-[#00C2A8]">
                  +{stats.totalSiglas}
                </p>
                <p className="text-[10px] sm:text-xs text-[#B6C2D0] uppercase tracking-wider font-medium mt-2">Siglas Cadastradas</p>
              </div>
              <div className="p-5 sm:p-6 bg-[#111C31] hover:bg-[#162540] border border-white/[0.08] rounded-[20px] transition-all duration-250 scale-100 hover:scale-102">
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-[#00C2A8]">
                  +{stats.totalCategorias}
                </p>
                <p className="text-[10px] sm:text-xs text-[#B6C2D0] uppercase tracking-wider font-medium mt-2">Áreas de Negócios</p>
              </div>
              <div className="p-5 sm:p-6 bg-[#111C31] hover:bg-[#162540] border border-white/[0.08] rounded-[20px] transition-all duration-250 scale-100 hover:scale-102 col-span-2 sm:col-span-1">
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-[#00C2A8]">
                  Instantânea
                </p>
                <p className="text-[10px] sm:text-xs text-[#B6C2D0] uppercase tracking-wider font-medium mt-2">Busca Otimizada</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ads Top space */}
      <AdsPlaceholder position="top" />

      {/* 2. Interactive Navigation Filters & Siglas Grid - mt-14 is exactly 56px (Stats -> Categories: 56px) */}
      <section className="px-5 min-[360px]:px-6 md:px-8 xl:px-8 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8 mt-14">
        {/* Main Content Area: Left/Mid (Grid) */}
        <div className="lg:col-span-3 space-y-6">
          {showCategoryGrid ? (
            <div className="space-y-6">
              <div className="border-b border-white/[0.06] pb-4">
                <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                  <span>Explore por Área de Negócio</span>
                </h2>
                <p className="text-xs text-[#B6C2D0] mt-2">
                  Selecione uma categoria abaixo para visualizar suas siglas ou utilize a barra de pesquisa acima para encontrar um termo específico.
                </p>
              </div>

              {/* Cards layout gap-5 is exactly 20px (Between cards: 20px) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {featuredCategoriesList.map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="group relative p-6 bg-[#111C31] border border-white/[0.08] hover:bg-[#162540] rounded-[20px] transition-all duration-250 hover:scale-102 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] shadow-md cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-[#0D1628] border border-white/[0.05] text-[#00C2A8] group-hover:text-[#00D8BB] transition-colors shrink-0">
                          {cat.icon}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#B6C2D0] bg-[#0D1628] border border-white/[0.06] px-2.5 py-0.5 rounded-md">
                          {siglas.filter(s => s.categoria.toLowerCase() === cat.name.toLowerCase()).length || "0"} siglas
                        </span>
                      </div>

                      <h3 className="font-display font-extrabold text-lg text-white group-hover:text-[#00C2A8] transition-colors mb-2">
                        {cat.name}
                      </h3>

                      <p className="text-xs text-[#B6C2D0] leading-relaxed mb-4">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06] mt-auto">
                      <span className="text-[10px] text-[#7C8AA5] font-medium">
                        Exemplos: <strong className="font-mono text-[#00C2A8] font-semibold">{cat.examples}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Header titles for current filtered content */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                    <span>
                      {selectedCategory === "Todas" 
                        ? "Todas as Siglas" 
                        : `Siglas de ${selectedCategory}`
                      }
                    </span>
                    <span className="text-sm font-mono text-[#00C2A8] bg-[#111C31] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                      {sortedSiglas.length}
                    </span>
                  </h2>
                  <p className="text-xs text-[#B6C2D0] mt-1">
                    Filtrado por letra: <span className="font-bold text-[#00C2A8]">{selectedLetter}</span> | Ordem: <span className="font-bold text-[#00C2A8]">{sortOrder === "az" ? "A-Z" : sortOrder === "za" ? "Z-A" : sortOrder === "popular" ? "Mais Popular" : "Mais Recente"}</span>
                  </p>
                </div>

                {/* Sorting Selection Toolbar */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#B6C2D0] font-semibold uppercase">Ordenar por:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="text-xs font-semibold text-white bg-[#111C31] border border-white/[0.08] rounded-lg p-2 focus:ring-1 focus:ring-[#00C2A8] outline-none cursor-pointer"
                  >
                    <option value="az">Alfabética: A-Z</option>
                    <option value="za">Alfabética: Z-A</option>
                    <option value="popular">Popularidade</option>
                    <option value="recente">Mais Recente</option>
                  </select>
                </div>
              </div>

              {/* SEO-Optimized Introductory Text for selected category */}
              <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] leading-relaxed text-sm text-[#B6C2D0]">
                <p>
                  {CATEGORY_INTRO_TEXTS[selectedCategory] || `Explore nosso dicionário e lista de siglas corporativas de ${selectedCategory}. Aprenda o significado, a tradução, exemplos práticos de uso em reuniões e e-mails, e entenda a importância de dominar estes jargões corporativos para crescer no ambiente profissional.`}
                </p>
              </div>

              {/* Horizontal Alphabet Filter Bar */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.06]">
                <span className="text-xs font-semibold text-[#7C8AA5] uppercase shrink-0">Letra:</span>
                <div className="flex space-x-1">
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => setSelectedLetter(letter)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-250 ${
                        selectedLetter === letter
                          ? "bg-[#00C2A8] text-[#07111F] font-bold shadow-md"
                          : "text-[#B6C2D0] hover:bg-[#111C31] hover:text-white"
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Grid list of Acronyms - gap-5 is exactly 20px (Between cards: 20px) */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SiglaCardSkeleton />
                  <SiglaCardSkeleton />
                  <SiglaCardSkeleton />
                  <SiglaCardSkeleton />
                </div>
              ) : sortedSiglas.length === 0 ? (
                <div className="p-12 text-center bg-[#111C31] border border-white/[0.08] rounded-[20px]">
                  <HelpCircle className="w-12 h-12 text-[#7C8AA5] mx-auto mb-4" />
                  <p className="text-white font-medium">Nenhuma sigla encontrada.</p>
                  <p className="text-xs text-[#B6C2D0] max-w-sm mx-auto mt-1">
                    Tente ajustar os filtros, limpar a pesquisa ou adicione sua própria sigla na área de contribuição comunitária à direita!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {sortedSiglas.map((item) => {
                    const isFavorite = favorites.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/sigla/${item.slug}`)}
                        className="group relative p-6 bg-[#111C31] border border-white/[0.08] hover:bg-[#162540] hover:scale-102 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] shadow-md rounded-[20px] transition-all duration-250 cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Card Info Row */}
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="font-display font-extrabold text-2xl text-white tracking-tight group-hover:text-[#00C2A8] transition-colors">
                              {item.sigla}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#0D1628] text-[#00C2A8] border border-white/[0.05]">
                                {item.categoria}
                              </span>
                            </div>
                          </div>

                          {/* Meanings */}
                          <p className="text-sm font-semibold text-[#B6C2D0] group-hover:text-white line-clamp-1 mb-2">
                            {item.nome_completo}
                            {item.traducao && item.traducao !== "Não aplicável" && (
                              <span className="text-xs font-normal text-[#7C8AA5] block">
                                Trad: {item.traducao}
                              </span>
                            )}
                          </p>

                          <p className="text-xs text-[#B6C2D0] line-clamp-2 leading-relaxed">
                            {item.descricao_curta}
                          </p>
                        </div>

                        {/* Bottom Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-4 mt-auto border-t border-white/[0.06]">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono font-medium text-[#7C8AA5]"
                            >
                              #{tag.toLowerCase()}
                            </span>
                          ))}
                          <span className="text-[10px] font-bold text-[#00C2A8] ml-auto flex items-center group-hover:translate-x-1 transition-transform">
                            Detalhes <ChevronRight className="w-3 h-3 ml-0.5 text-[#00C2A8]" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar Panel: Category quick access list & Community Suggestion Form */}
        <div className="space-y-6">
          {/* A. Category Filter Sidebar */}
          <div className="p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8AA5] mb-4 flex items-center justify-between">
              <span>Navegar por Áreas</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#00C2A8]" />
            </h3>
            <div className="flex flex-col space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setShowFavorites(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-250 flex items-center justify-between ${
                    selectedCategory === cat
                      ? "text-[#00C2A8] bg-[#0D1628] border border-white/[0.05] font-semibold"
                      : "text-[#B6C2D0] hover:text-white hover:bg-[#162540]"
                  }`}
                >
                  <span>{cat}</span>
                  {stats && (
                    <span className="text-[10px] font-mono text-[#B6C2D0] bg-[#0D1628] border border-white/[0.06] px-1.5 py-0.5 rounded-md">
                      {cat === "Todas" 
                        ? siglas.length 
                        : siglas.filter(s => s.categoria.toLowerCase() === cat.toLowerCase()).length
                      }
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* B. Community Contribution form */}
          <div className="p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-lg space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                <Award className="w-4.5 h-4.5 text-[#00C2A8]" />
                <span>Sugestão Comunitária</span>
              </h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed mt-1">
                Ajude-nos a crescer! Envie uma sigla nova com seu respectivo significado para o nosso acervo comunitário.
              </p>
            </div>

            <form onSubmit={handleContribSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7C8AA5] mb-1">Sigla</label>
                <input
                  type="text"
                  value={contribSigla}
                  onChange={(e) => setContribSigla(e.target.value.toUpperCase())}
                  placeholder="EX: LTV, CAGR, ROI"
                  className="w-full text-xs p-2.5 bg-[#0D1628] text-white border border-white/[0.08] rounded-lg outline-none font-bold placeholder-[#7C8AA5] focus:ring-1 focus:ring-[#00C2A8] focus:border-[#00C2A8] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7C8AA5] mb-1">Área / Categoria</label>
                <select
                  value={contribCategory}
                  onChange={(e) => setContribCategory(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#0D1628] text-white border border-white/[0.08] rounded-lg outline-none focus:ring-1 focus:ring-[#00C2A8] focus:border-[#00C2A8] transition-all cursor-pointer"
                >
                  {categories.filter(c => c !== "Todas").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7C8AA5] mb-1">Significado / Nome Completo</label>
                <input
                  type="text"
                  value={contribNomeCompleto}
                  onChange={(e) => setContribNomeCompleto(e.target.value)}
                  placeholder="EX: Lifetime Value"
                  className="w-full text-xs p-2.5 bg-[#0D1628] text-white border border-white/[0.08] rounded-lg outline-none placeholder-[#7C8AA5] focus:ring-1 focus:ring-[#00C2A8] focus:border-[#00C2A8] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7C8AA5] mb-1">Descrição Curta</label>
                <textarea
                  value={contribDescricaoCurta}
                  onChange={(e) => setContribDescricaoCurta(e.target.value)}
                  placeholder="EX: Métrica que estima todo o potencial de faturamento gerado por um cliente..."
                  rows={2}
                  className="w-full text-xs p-2.5 bg-[#0D1628] text-white border border-white/[0.08] rounded-lg outline-none placeholder-[#7C8AA5] focus:ring-1 focus:ring-[#00C2A8] focus:border-[#00C2A8] transition-all resize-none"
                  required
                />
              </div>

              {/* Submit button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={contribSubmitting || !contribSigla.trim()}
                  className="w-full py-2.5 bg-[#00C2A8] text-[#07111F] hover:bg-[#00D8BB] font-bold text-xs rounded-lg transition-all duration-250 flex items-center justify-center space-x-1.5 disabled:opacity-50 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{contribSubmitting ? "Enviando..." : "Enviar Sugestão"}</span>
                </button>
              </div>

              {contribError && (
                <p className="text-[10px] text-[#EF4444] font-semibold leading-normal">{contribError}</p>
              )}

              {contribSuccess && (
                <div className="p-2.5 bg-[#10B981]/15 text-[#10B981] rounded-lg text-[10px] font-semibold flex items-center space-x-1.5 leading-normal border border-[#10B981]/25 animate-pulse">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Sigla adicionada com sucesso ao dicionário!</span>
                </div>
              )}
            </form>
          </div>

          {/* Ads sidebar */}
          <AdsPlaceholder position="sidebar" />
        </div>
      </section>

      {/* 3. Integrated Blog Highlights Grid - mt-14/py-14 is exactly 56px (Categories -> Articles: 56px) */}
      {recentPosts.length > 0 && (
        <section className="bg-[#0D1628] py-14 border-y border-white/[0.08] transition-all">
          <div className="px-5 min-[360px]:px-6 md:px-8 xl:px-8 max-w-[1280px] mx-auto w-full space-y-6">
            <div className="flex items-end justify-between border-b border-white/[0.06] pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00C2A8]">Educação Executiva</span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Artigos e Guias do Blog
                </h2>
              </div>
              <button
                onClick={() => navigate("/blog")}
                className="text-xs font-bold text-[#00C2A8] hover:text-[#00D8BB] flex items-center space-x-1 shrink-0 transition-colors"
              >
                <span>Ver todo o blog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentPosts.map((article) => (
                <div
                  key={article.id}
                  onClick={() => navigate(`/blog/${article.slug}`)}
                  className="bg-[#111C31] border border-white/[0.08] hover:bg-[#162540] hover:scale-102 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] shadow-md rounded-[20px] p-5 sm:p-6 space-y-4 transition-all duration-250 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-[#7C8AA5] uppercase tracking-wider">
                      <span className="px-2.5 py-0.5 bg-[#0D1628] rounded-full border border-white/[0.05]">{article.categoria}</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {article.tempo_leitura}</span>
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-white line-clamp-2 leading-tight hover:text-[#00C2A8] transition-colors">
                      {article.titulo}
                    </h3>
                    <p className="text-xs text-[#B6C2D0] line-clamp-3 leading-relaxed">
                      {article.descricao}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-4 mt-4 border-t border-white/[0.06]">
                    <div className="w-7 h-7 rounded-full bg-[#0D1628] border border-white/[0.05] flex items-center justify-center text-[11px] font-bold text-[#00C2A8] font-mono">
                      {article.autor.charAt(0)}
                    </div>
                    <div className="text-[11px]">
                      <span className="font-semibold text-white block leading-none mb-0.5">{article.autor.split(",")[0]}</span>
                      <span className="text-[#7C8AA5] font-mono block text-[9px]">{article.data}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Semantic SEO Learning Guide Section */}
      <section className="px-5 min-[360px]:px-6 md:px-8 xl:px-8 max-w-[1280px] mx-auto w-full py-14 border-t border-white/[0.08] transition-all">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#111C31] border border-white/[0.08] text-[#00C2A8]">
              Guia Completo de Aprendizado
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              Como Aprender a Linguagem de Siglas Corporativas?
            </h2>
            <p className="text-sm text-[#B6C2D0] max-w-xl mx-auto mt-2 leading-relaxed">
              Entenda a importância de dominar o jargão do mercado corporativo internacional e saiba como acelerar seu aprendizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <div className="p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] hover:bg-[#162540] transition-all duration-250 space-y-3">
              <h3 className="font-display font-bold text-base text-white">
                1. O que é a linguagem de siglas corporativas?
              </h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                No ambiente corporativo moderno, siglas como **OKR**, **KPI**, **LTV** e **CAC** funcionam como uma linguagem de siglas corporativas própria. Elas são amplamente utilizadas para resumir métricas complexas, cargos executivos (como **CEO**, **CFO**) e metodologias de gestão rápida de processos. Aprender esses termos é fundamental para compreender apresentações de negócios, relatórios financeiros e e-mails de liderança.
              </p>
            </div>

            <div className="p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] hover:bg-[#162540] transition-all duration-250 space-y-3">
              <h3 className="font-display font-bold text-base text-white">
                2. Como aprender siglas corporativas em português e inglês?
              </h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Muitas das expressões mais comuns têm origem estrangeira. Por isso, oferecemos um **dicionário de siglas corporativas** que ajuda você a aprender termos em português e inglês de forma unificada. Estudar as definições acompanhadas de suas traduções e equivalentes diretos no Brasil permite que você se sinta seguro tanto em reuniões locais quanto em negociações com multinacionais estrangeiras.
              </p>
            </div>

            <div className="p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] hover:bg-[#162540] transition-all duration-250 space-y-3">
              <h3 className="font-display font-bold text-base text-white">
                3. Por que usar um dicionário corporativo para aprender?
              </h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Em vez de pesquisar termos isoladamente no Google, um dicionário de siglas corporativas focado centraliza o conhecimento técnico. Nosso portal é estruturado por categorias como *Financeiro, Marketing, Tecnologia e Logística*, facilitando a memorização progressiva dos jargões mais usados em cada departamento específico.
              </p>
            </div>

            <div className="p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] hover:bg-[#162540] transition-all duration-250 space-y-3">
              <h3 className="font-display font-bold text-base text-white">
                4. Como baixar o dicionário de siglas corporativas em PDF grátis?
              </h3>
              <p className="text-xs text-[#B6C2D0] leading-relaxed">
                Para quem prefere estudar offline ou ter uma colinha impressa para consulta rápida durante chamadas importantes, disponibilizamos o recurso de **siglas corporativas aprender pdf**. Basta clicar em "Baixar Dicionário em PDF" no menu lateral para visualizar e salvar o guia profissional completo sem custo algum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ads Footer space */}
      <AdsPlaceholder position="footer" />
    </div>
  );
}
