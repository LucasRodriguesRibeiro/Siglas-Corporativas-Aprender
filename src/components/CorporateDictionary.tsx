import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Tag, Layers, Clock, Sparkles } from "lucide-react";
import { getItemUrl, Sigla } from "../types";
import { getAllSiglas } from "../data/dataService";

interface CorporateDictionaryProps {
  navigate: (to: string) => void;
  className?: string;
  title?: string;
  subtitle?: string;
}

const CATEGORY_PATH_MAP: Record<string, string> = {
  "Marketing": "/siglas-marketing",
  "Recursos Humanos": "/siglas-rh",
  "Financeiro": "/siglas-financeiras",
  "Tecnologia": "/siglas-tecnologia",
  "Vendas": "/siglas-vendas",
  "Logística": "/siglas-logistica",
  "Gestão": "/siglas-gestao",
  "Contabilidade": "/siglas-contabilidade",
  "Jurídico": "/siglas-juridicas",
  "Saúde": "/siglas-saude",
  "Projetos": "/siglas-projetos",
  "Administrativo": "/siglas-administrativas",
  "Comercial": "/siglas-comerciais",
  "Engenharia": "/siglas-engenharia",
  "Compras": "/siglas-compras"
};

const POPULAR_SIGLAS = ["OKR", "KPI", "ROI", "CEO", "EBITDA", "CAC", "LTV", "CRM", "SLA", "B2B", "B2C", "DRE"];
const POPULAR_TERMOS = ["Stakeholder", "Onboarding", "Compliance", "Benchmark", "Pitch", "Turnover", "Feedback", "Mindset", "Sprint", "Pipeline"];
const POPULAR_CATEGORIES = ["Marketing", "Recursos Humanos", "Financeiro", "Tecnologia", "Vendas", "Logística", "Gestão", "Contabilidade", "Jurídico"];

export default function CorporateDictionary({
  navigate,
  className = "",
  title = "🔍 Dicionário Corporativo",
  subtitle = "Pesquise gratuitamente centenas de siglas, termos corporativos, cargos e metodologias."
}: CorporateDictionaryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [allSiglas, setAllSiglas] = useState<Sigla[]>([]);
  const [activeTab, setActiveTab] = useState<"siglas" | "termos" | "categorias" | "recentes">("siglas");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load all siglas and recent searches on mount
  useEffect(() => {
    try {
      const data = getAllSiglas();
      setAllSiglas(data);

      const raw = localStorage.getItem("dicionario_recent_searches");
      if (raw) {
        setRecentSearches(JSON.parse(raw));
      } else {
        setRecentSearches(["OKR", "EBITDA", "Stakeholder", "CRM", "Compliance"]);
      }
    } catch (err) {
      console.error("Erro ao carregar dados no CorporateDictionary:", err);
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter(s => s.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem("dicionario_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Erro ao salvar pesquisa recente:", e);
    }
  };

  // Autocomplete Suggestions (top 6 matched items)
  const autocompleteSuggestions = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const startsWithSigla: Sigla[] = [];
    const containsSigla: Sigla[] = [];
    const containsName: Sigla[] = [];
    const containsOthers: Sigla[] = [];

    for (const item of allSiglas) {
      const siglaLower = item.sigla.toLowerCase();
      const nomeLower = item.nome_completo.toLowerCase();
      const descLower = item.descricao_curta.toLowerCase();

      if (siglaLower.startsWith(q)) {
        startsWithSigla.push(item);
      } else if (siglaLower.includes(q)) {
        containsSigla.push(item);
      } else if (nomeLower.includes(q)) {
        containsName.push(item);
      } else if (descLower.includes(q) || item.categoria.toLowerCase().includes(q)) {
        containsOthers.push(item);
      }
    }

    return [...startsWithSigla, ...containsSigla, ...containsName, ...containsOthers].slice(0, 6);
  })();

  const handleSelectItem = (item: Sigla) => {
    saveRecentSearch(item.sigla);
    navigate(getItemUrl(item));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim();
    saveRecentSearch(q);

    // If exact match exists, go directly to item page
    const exactMatch = allSiglas.find(
      s => s.sigla.toLowerCase() === q.toLowerCase() || s.slug.toLowerCase() === q.toLowerCase()
    );

    if (exactMatch) {
      navigate(getItemUrl(exactMatch));
    } else {
      navigate(`/?search=${encodeURIComponent(q)}`);
    }
  };

  const handleTagClick = (term: string) => {
    saveRecentSearch(term);
    const item = allSiglas.find(
      s => s.sigla.toLowerCase() === term.toLowerCase() || s.slug.toLowerCase() === term.toLowerCase()
    );
    if (item) {
      navigate(getItemUrl(item));
    } else {
      navigate(`/?search=${encodeURIComponent(term)}`);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    const path = CATEGORY_PATH_MAP[categoryName] || `/?categoria=${encodeURIComponent(categoryName)}`;
    navigate(path);
  };

  return (
    <div className={`bg-[#111C31] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-xl space-y-6 ${className}`}>
      {/* Title & Description */}
      <div className="text-center space-y-2">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white flex items-center justify-center space-x-2">
          <span>{title}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#B6C2D0] font-medium max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Main Reusable Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center h-[58px] bg-[#07111F] hover:bg-[#0d1628] border border-white/[0.12] rounded-[18px] shadow-lg focus-within:ring-2 focus-within:ring-[#00C2A8]/40 focus-within:border-[#00C2A8] transition-all duration-250 overflow-hidden">
          <div className="pl-4 text-[#7C8AA5]">
            <Search className="w-5 h-5 text-[#00C2A8]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Pesquisar sigla, termo, cargo ou área... (ex: OKR, CEO, ROI)"
            className="w-full py-3.5 px-3 text-white bg-transparent placeholder-[#7C8AA5] outline-none text-base font-normal"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="pr-4 text-xs font-semibold text-[#7C8AA5] hover:text-white transition-colors duration-250"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown overlay */}
        {isFocused && autocompleteSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0D1628] border border-white/[0.12] rounded-[18px] shadow-2xl z-50 text-left overflow-hidden divide-y divide-white/[0.06]">
            {autocompleteSuggestions.map((item) => (
              <div
                key={item.id}
                onMouseDown={() => handleSelectItem(item)}
                className="p-3.5 hover:bg-[#162540] cursor-pointer flex items-center justify-between transition-colors duration-250"
              >
                <div>
                  <span className="font-display font-extrabold text-[#00C2A8] text-base mr-3">
                    {item.sigla}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white">
                    {item.nome_completo}
                  </span>
                </div>
                <span className="text-[10px] text-[#B6C2D0] font-mono bg-[#111C31] border border-white/[0.08] px-2 py-0.5 rounded-md">
                  {item.categoria}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA below search bar */}
        <p className="text-xs sm:text-sm font-semibold text-[#00C2A8] text-center mt-3">
          Pesquise qualquer sigla ou termo corporativo.
        </p>
      </form>

      {/* Tabs / Links Sections */}
      <div className="pt-2 border-t border-white/[0.06] space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("siglas")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-250 flex items-center space-x-1.5 ${
              activeTab === "siglas"
                ? "bg-[#00C2A8] text-[#07111F] shadow-sm"
                : "bg-[#0D1628] text-[#B6C2D0] hover:text-white hover:bg-[#162540]"
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Siglas populares</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("termos")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-250 flex items-center space-x-1.5 ${
              activeTab === "termos"
                ? "bg-[#00C2A8] text-[#07111F] shadow-sm"
                : "bg-[#0D1628] text-[#B6C2D0] hover:text-white hover:bg-[#162540]"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Termos populares</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categorias")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-250 flex items-center space-x-1.5 ${
              activeTab === "categorias"
                ? "bg-[#00C2A8] text-[#07111F] shadow-sm"
                : "bg-[#0D1628] text-[#B6C2D0] hover:text-white hover:bg-[#162540]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categorias</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("recentes")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-250 flex items-center space-x-1.5 ${
              activeTab === "recentes"
                ? "bg-[#00C2A8] text-[#07111F] shadow-sm"
                : "bg-[#0D1628] text-[#B6C2D0] hover:text-white hover:bg-[#162540]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Últimas pesquisas</span>
          </button>
        </div>

        {/* Tag Grid display based on active tab */}
        <div className="flex flex-wrap justify-center gap-2 pt-1 max-w-3xl mx-auto">
          {activeTab === "siglas" &&
            POPULAR_SIGLAS.map((s) => (
              <button
                key={s}
                onClick={() => handleTagClick(s)}
                className="px-3 py-1 bg-[#0D1628] hover:bg-[#162540] text-[#B6C2D0] hover:text-[#00C2A8] border border-white/[0.08] hover:border-[#00C2A8]/40 rounded-xl text-xs font-semibold transition-all duration-250"
              >
                {s}
              </button>
            ))}

          {activeTab === "termos" &&
            POPULAR_TERMOS.map((t) => (
              <button
                key={t}
                onClick={() => handleTagClick(t)}
                className="px-3 py-1 bg-[#0D1628] hover:bg-[#162540] text-[#B6C2D0] hover:text-[#00C2A8] border border-white/[0.08] hover:border-[#00C2A8]/40 rounded-xl text-xs font-semibold transition-all duration-250"
              >
                {t}
              </button>
            ))}

          {activeTab === "categorias" &&
            POPULAR_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryClick(c)}
                className="px-3 py-1 bg-[#0D1628] hover:bg-[#162540] text-[#B6C2D0] hover:text-[#00C2A8] border border-white/[0.08] hover:border-[#00C2A8]/40 rounded-xl text-xs font-semibold transition-all duration-250"
              >
                {c}
              </button>
            ))}

          {activeTab === "recentes" &&
            recentSearches.map((r, idx) => (
              <button
                key={idx}
                onClick={() => handleTagClick(r)}
                className="px-3 py-1 bg-[#0D1628] hover:bg-[#162540] text-[#B6C2D0] hover:text-[#00C2A8] border border-white/[0.08] hover:border-[#00C2A8]/40 rounded-xl text-xs font-semibold transition-all duration-250 flex items-center space-x-1"
              >
                <Clock className="w-3 h-3 text-[#7C8AA5]" />
                <span>{r}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
