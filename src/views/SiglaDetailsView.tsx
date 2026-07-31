import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Bookmark, 
  Copy, 
  Check, 
  HelpCircle, 
  Compass, 
  History, 
  Volume2, 
  BookOpen, 
  Layers, 
  Tag, 
  ChevronRight,
  Search,
  BookmarkCheck,
  Share2,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Sigla, getItemUrl } from "../types";
import AdsPlaceholder from "../components/AdsPlaceholder";
import CorporateDictionary from "../components/CorporateDictionary";
import { TIPO_LABELS } from "./HomeView";
import { getSiglaBySlug, getFilteredSiglas, getAllSiglas, getBlogArticles } from "../data/dataService";
import { useUsageLimit } from "../context/UsageContext";

interface SiglaDetailsViewProps {
  slug: string;
  navigate: (to: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function SiglaDetailsView({
  slug,
  navigate,
  favorites,
  toggleFavorite,
}: SiglaDetailsViewProps) {
  const [sigla, setSigla] = useState<Sigla | null>(null);
  const [related, setRelated] = useState<Sigla[]>([]);
  const [relatedTerms, setRelatedTerms] = useState<Sigla[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Action status indicators
  const [copiedMeaning, setCopiedMeaning] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const { usageCount, maxFreeUses, isUnlocked, setShowPaywall } = useUsageLimit();

  // Load selected sigla data
  useEffect(() => {
    if (usageCount >= maxFreeUses && !isUnlocked) {
      setShowPaywall(true);
    }
  }, [slug, usageCount, maxFreeUses, isUnlocked]);

  useEffect(() => {
    function loadSigla() {
      try {
        setLoading(true);
        setError(false);
        
        const data = getSiglaBySlug(slug);
        if (!data) {
          setError(true);
          setLoading(false);
          return;
        }

        setSigla(data);

        // Fetch all items to build related lists
        const allItems = getAllSiglas();

        // 1. Siglas Relacionadas (Same category or matching tags)
        const sameCategorySiglas = allItems
          .filter(item => item.id !== data.id && item.categoria.toLowerCase() === data.categoria.toLowerCase())
          .slice(0, 5);

        setRelated(sameCategorySiglas.length > 0 ? sameCategorySiglas : allItems.filter(item => item.id !== data.id).slice(0, 5));

        // 2. Termos & Conceitos Relacionados
        const termsList = allItems
          .filter(item => item.id !== data.id && (item.tipo && item.tipo !== "SIGLA"))
          .slice(0, 5);

        setRelatedTerms(termsList.length > 0 ? termsList : allItems.filter(item => item.id !== data.id).slice(5, 10));

        // 3. Fetch related blog articles
        const blogData = getBlogArticles();
        const filteredBlog = blogData.filter((post: any) => 
          post.categoria.toLowerCase() === data.categoria.toLowerCase()
        ).slice(0, 3);

        if (filteredBlog.length < 3) {
          const otherBlog = blogData.filter((post: any) => 
            post.categoria.toLowerCase() !== data.categoria.toLowerCase()
          );
          setRelatedPosts([...filteredBlog, ...otherBlog].slice(0, 3));
        } else {
          setRelatedPosts(filteredBlog);
        }
      } catch (err) {
        console.error("Erro ao carregar termo/sigla:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadSigla();
  }, [slug]);

  // SEO Automático: Injeta Dynamic Head Tags, Meta Description, Canonical, OG e Schema.org no DOM
  useEffect(() => {
    if (!sigla) return;

    const baseUrl = "https://siglascorporativasaprender.com.br";
    const currentUrl = `${baseUrl}${getItemUrl(sigla)}`;

    const pageTitle = `${sigla.sigla} - O que é, Significado e Exemplo (${sigla.nome_completo}) | Dicionário Corporativo`;
    const pageDesc = `O que significa ${sigla.sigla} (${sigla.nome_completo})? Saiba o significado completo em ${sigla.categoria}, exemplo prático em reuniões, tradução, origem e pronúncia.`;

    document.title = pageTitle;

    // Helper para atualizar ou criar meta tags
    const setMetaTag = (attr: string, value: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);

    // Meta Description & Open Graph
    setMetaTag("name", "description", pageDesc);
    setMetaTag("property", "og:title", pageTitle);
    setMetaTag("property", "og:description", pageDesc);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:type", "article");
    setMetaTag("property", "og:site_name", "Dicionário Corporativo");
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", pageTitle);
    setMetaTag("name", "twitter:description", pageDesc);

    // Dynamic Schema.org JSON-LD (DefinedTerm + FAQPage + BreadcrumbList)
    const definedTermSchema = {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": sigla.sigla,
      "termCode": sigla.sigla,
      "description": `${sigla.nome_completo} - ${sigla.descricao_curta}`,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "Dicionário Corporativo",
        "url": baseUrl
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `O que significa a sigla ${sigla.sigla}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${sigla.sigla} significa "${sigla.nome_completo}". ${sigla.descricao_curta}`
          }
        },
        {
          "@type": "Question",
          "name": `Como utilizar ${sigla.sigla} em reuniões ou e-mails de trabalho?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Você pode utilizar a seguinte frase prática: "${sigla.exemplo}"`
          }
        },
        {
          "@type": "Question",
          "name": `Qual a pronúncia correta de ${sigla.sigla}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `A pronúncia usual de ${sigla.sigla} no ambiente corporativo brasileiro é "${sigla.pronuncia}".`
          }
        },
        {
          "@type": "Question",
          "name": `A qual área empresarial ${sigla.sigla} pertence?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${sigla.sigla} é amplamente empregado na área de ${sigla.categoria} (${sigla.subcategoria || "Gestão Geral"}).`
          }
        }
      ]
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Início", "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": sigla.categoria, "item": `${baseUrl}/#categoria=${encodeURIComponent(sigla.categoria)}` },
        { "@type": "ListItem", "position": 3, "name": sigla.sigla, "item": currentUrl }
      ]
    };

    let scriptEl = document.getElementById("seo-schema-jsonld");
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = "seo-schema-jsonld";
      scriptEl.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify([definedTermSchema, faqSchema, breadcrumbSchema]);

    return () => {
      // Clean up dynamic schema element on unmount
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [sigla]);

  // Handle Copy Meaning
  function handleCopyMeaning() {
    if (!sigla) return;
    const text = `Significado de ${sigla.sigla}: ${sigla.nome_completo}.\n${sigla.descricao_curta}\nExemplo: "${sigla.exemplo}"\nSaiba mais em: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopiedMeaning(true);
    setTimeout(() => setCopiedMeaning(false), 2000);
  }

  // Play pronunciation via browser Text-to-Speech
  function handlePlayPronunciation() {
    if (!sigla) return;
    try {
      setAudioPlayed(true);
      const textToSpeak = `${sigla.sigla}. ${sigla.nome_completo}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = sigla.origem === "Inglês" ? "en-US" : "pt-BR";
      window.speechSynthesis.speak(utterance);
      setTimeout(() => setAudioPlayed(false), 1500);
    } catch (err) {
      console.warn("TTS não suportado no navegador.");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 animate-pulse bg-[#07111F]">
        <div className="h-6 w-36 bg-[#111C31] border border-white/[0.08] rounded" />
        <div className="h-16 w-3/4 bg-[#111C31] border border-white/[0.08] rounded-[18px]" />
        <div className="h-28 w-full bg-[#111C31] border border-white/[0.08] rounded-[18px]" />
        <div className="h-48 w-full bg-[#111C31] border border-white/[0.08] rounded-[18px]" />
      </div>
    );
  }

  if (error || !sigla) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 bg-[#07111F]">
        <HelpCircle className="w-16 h-16 text-[#7C8AA5] mx-auto" />
        <div className="space-y-1.5">
          <h2 className="font-display font-extrabold text-2xl text-white">Termo Não Encontrado</h2>
          <p className="text-sm text-[#B6C2D0]">
            O termo, sigla ou URL informada não foi localizado no nosso dicionário corporativo.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-[#00C2A8] hover:bg-[#00D8BB] text-[#07111F] font-bold rounded-xl transition-all duration-250 shadow-md"
        >
          Voltar para a Busca Principal
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(sigla.id);

  return (
    <div className="max-w-[1280px] mx-auto px-5 min-[360px]:px-6 md:px-8 w-full py-8 space-y-10 bg-[#07111F]">
      
      {/* 1. Breadcrumbs Visual & Top Navigation Button */}
      <nav aria-label="Breadcrumb" className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-4 gap-3 text-xs font-medium text-[#7C8AA5]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-1.5 text-[#B6C2D0] hover:text-[#00C2A8] transition-colors py-1.5 px-3 bg-[#111C31] border border-white/[0.08] rounded-xl self-start"
          id="btn-back-home"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para busca</span>
        </button>

        <ol className="flex items-center space-x-1.5 font-bold text-[11px] uppercase tracking-wider flex-wrap">
          <li>
            <button onClick={() => navigate("/")} className="hover:text-white transition-colors">Início</button>
          </li>
          <li><ChevronRight className="w-3 h-3 text-white/[0.2]" /></li>
          <li>
            <button onClick={() => navigate("/")} className="hover:text-white transition-colors">{sigla.categoria}</button>
          </li>
          <li><ChevronRight className="w-3 h-3 text-white/[0.2]" /></li>
          <li className="text-[#00C2A8] font-extrabold">{sigla.sigla}</li>
        </ol>
      </nav>

      {/* Ads inline slot */}
      <AdsPlaceholder position="top" />

      {/* 2. Main content container split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Term main data card (Middle columns) */}
        <div className="lg:col-span-3 space-y-8" id="sigla-detail-body">
          
          {/* Header information card */}
          <article className="bg-[#111C31] p-5 sm:p-6 md:p-8 border border-white/[0.08] rounded-[20px] space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {sigla.tipo && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00C2A8]/10 text-[#00C2A8] border border-[#00C2A8]/15">
                      {TIPO_LABELS[sigla.tipo] || sigla.tipo}
                    </span>
                  )}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0D1628] text-[#B6C2D0] border border-white/[0.05]">
                    Área: {sigla.categoria}
                  </span>
                </div>
                
                {/* H1 Principal Otimizado para SEO */}
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight flex items-center flex-wrap gap-3">
                  <span>{sigla.sigla} - {sigla.nome_completo}</span>
                  <button 
                    onClick={handlePlayPronunciation}
                    className={`p-1.5 bg-[#0D1628] hover:bg-[#162540] border border-white/[0.08] rounded-xl transition-all ${audioPlayed ? "text-[#00C2A8] animate-bounce" : "text-[#7C8AA5] hover:text-[#00C2A8]"}`}
                    title="Ouvir pronúncia"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </h1>

                {sigla.traducao && sigla.traducao !== "Não aplicável" && (
                  <p className="text-sm font-medium text-[#7C8AA5] italic">
                    Tradução em Português: <span className="font-semibold text-white">{sigla.traducao}</span>
                  </p>
                )}
              </div>

              {/* Action buttons (Copy & Bookmark) */}
              <div className="flex items-center space-x-2 self-start shrink-0">
                <button
                  onClick={() => toggleFavorite(sigla.id)}
                  className={`p-2.5 bg-[#0D1628] border border-white/[0.08] rounded-xl transition-all flex items-center space-x-1.5 ${isFavorite ? "text-[#00C2A8]" : "text-[#B6C2D0] hover:text-white"}`}
                  title={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
                >
                  {isFavorite ? <BookmarkCheck className="w-5 h-5 text-[#00C2A8]" /> : <Bookmark className="w-5 h-5" />}
                  <span className="text-xs font-bold hidden sm:inline">{isFavorite ? "Salvo" : "Favoritar"}</span>
                </button>

                <button
                  onClick={handleCopyMeaning}
                  className="p-2.5 bg-[#0D1628] border border-white/[0.08] text-[#B6C2D0] hover:text-white rounded-xl transition-all flex items-center space-x-1.5"
                  title="Copiar significado"
                >
                  {copiedMeaning ? <Check className="w-5 h-5 text-[#10B981]" /> : <Copy className="w-5 h-5" />}
                  <span className="text-xs font-bold hidden sm:inline">{copiedMeaning ? "Copiado!" : "Copiar"}</span>
                </button>
              </div>
            </div>

            {/* Quick summary box */}
            <div className="p-5 sm:p-6 bg-[#0D1628] rounded-[18px] border border-white/[0.05]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C8AA5] block mb-1">
                Significado Resumido
              </span>
              <p className="text-sm text-[#B6C2D0] font-medium leading-relaxed">
                {sigla.descricao_curta}
              </p>
            </div>
          </article>

          {/* Detailed explanation sections */}
          <div className="space-y-6">
            <h2 className="font-display font-extrabold text-xl text-white border-b border-white/[0.06] pb-2">
              Explicação Detalhada
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* O que é */}
              <div className="p-5 sm:p-6 bg-[#111C31] hover:bg-[#162540] border border-white/[0.08] rounded-[20px] transition-all duration-250 shadow-md space-y-3">
                <h3 className="font-display font-bold text-base text-[#00C2A8] flex items-center space-x-2">
                  <BookOpen className="w-4.5 h-4.5" />
                  <span>O que de fato é?</span>
                </h3>
                <p className="text-xs text-[#B6C2D0] leading-relaxed">
                  {sigla.descricao_longa}
                </p>
              </div>

              {/* Exemplo Prático */}
              <div className="p-5 sm:p-6 bg-[#111C31] hover:bg-[#162540] border border-white/[0.08] rounded-[20px] transition-all duration-250 shadow-md space-y-3">
                <h3 className="font-display font-bold text-base text-[#10B981] flex items-center space-x-2">
                  <Layers className="w-4.5 h-4.5" />
                  <span>Exemplo de uso prático</span>
                </h3>
                <p className="text-xs text-[#B6C2D0] italic bg-[#0D1628] p-4 rounded-xl border border-dashed border-white/[0.08] leading-relaxed">
                  "{sigla.exemplo}"
                </p>
                <span className="text-[10px] text-[#7C8AA5] block font-medium">
                  Use esta frase em reuniões, e-mails e apresentações para demonstrar domínio técnico sobre {sigla.sigla}.
                </span>
              </div>

              {/* Origem */}
              <div className="p-5 sm:p-6 bg-[#111C31] hover:bg-[#162540] border border-white/[0.08] rounded-[20px] transition-all duration-250 shadow-md space-y-3">
                <h3 className="font-display font-bold text-base text-[#F59E0B] flex items-center space-x-2">
                  <Compass className="w-4.5 h-4.5" />
                  <span>Origem e Pronúncia</span>
                </h3>
                <ul className="space-y-2 text-xs text-[#B6C2D0]">
                  <li>
                    <strong className="text-white">Origem do termo:</strong> {sigla.origem}
                  </li>
                  <li>
                    <strong className="text-white">Pronúncia recomendada:</strong> {sigla.pronuncia}
                  </li>
                  <li>
                    <strong className="text-white">Subdivisão técnica:</strong> {sigla.subcategoria}
                  </li>
                </ul>
              </div>

              {/* História */}
              <div className="p-5 sm:p-6 bg-[#111C31] hover:bg-[#162540] border border-white/[0.08] rounded-[20px] transition-all duration-250 shadow-md space-y-3">
                <h3 className="font-display font-bold text-base text-[#3B82F6] flex items-center space-x-2">
                  <History className="w-4.5 h-4.5" />
                  <span>Contexto Histórico & Aplicação</span>
                </h3>
                <p className="text-xs text-[#B6C2D0] leading-relaxed">
                  {sigla.historia}
                </p>
              </div>
            </div>
          </div>

          {/* Content Ads Placeholder */}
          <AdsPlaceholder position="content" />

          {/* FAQ Section */}
          <section className="space-y-6" id="faq-section">
            <h2 className="font-display font-extrabold text-xl text-white border-b border-white/[0.06] pb-2 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#00C2A8]" />
              <span>Perguntas Frequentes sobre {sigla.sigla} (FAQ)</span>
            </h2>

            <div className="space-y-4">
              <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md space-y-2">
                <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-[#00C2A8] shrink-0" />
                  <span>O que significa a sigla ou termo {sigla.sigla}?</span>
                </h3>
                <p className="text-xs text-[#B6C2D0] leading-relaxed pl-6">
                  {sigla.sigla} significa "{sigla.nome_completo}". Em termos práticos: {sigla.descricao_curta}
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md space-y-2">
                <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-[#00C2A8] shrink-0" />
                  <span>Quando utilizar {sigla.sigla} na rotina empresarial?</span>
                </h3>
                <p className="text-xs text-[#B6C2D0] leading-relaxed pl-6">
                  O termo {sigla.sigla} deve ser utilizado em relatórios, alinhamentos de equipe e reuniões executivas da área de {sigla.categoria.toLowerCase()}. É ideal para padronizar a comunicação e alinhar métricas operacionais com a diretoria.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md space-y-2">
                <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-[#00C2A8] shrink-0" />
                  <span>Qual a forma correta de pronunciar {sigla.sigla}?</span>
                </h3>
                <p className="text-xs text-[#B6C2D0] leading-relaxed pl-6">
                  A pronúncia mais comum no ambiente de trabalho brasileiro é "{sigla.pronuncia}".
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar Column: Palavras-chave & Links Rápidos */}
        <aside className="space-y-6">
          <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8AA5] mb-4 flex items-center space-x-1.5">
              <Tag className="w-4 h-4 text-[#00C2A8]" />
              <span>Palavras-Chave e Indexação</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {sigla.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[#0D1628] text-[#B6C2D0] border border-white/[0.05] rounded-lg text-xs font-mono font-medium"
                >
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Categorias Guia Rápido */}
          <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8AA5] flex items-center justify-between">
              <span>Navegar por Área</span>
              <Layers className="w-3.5 h-3.5 text-[#00C2A8]" />
            </h3>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {[
                { name: "Gestão", path: "/siglas-gestao" },
                { name: "Marketing", path: "/siglas-marketing" },
                { name: "Tecnologia", path: "/siglas-tecnologia" },
                { name: "Vendas", path: "/siglas-vendas" },
                { name: "Financeiro", path: "/siglas-financeiras" },
                { name: "Recursos Humanos", path: "/siglas-rh" },
                { name: "Logística", path: "/siglas-logistica" }
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => navigate(c.path)}
                  className="w-full text-left px-3 py-2 rounded-lg text-[#B6C2D0] hover:bg-[#162540] hover:text-[#00C2A8] transition-colors font-medium flex items-center justify-between"
                >
                  <span>Siglas de {c.name}</span>
                  <ChevronRight className="w-3 h-3 text-white/[0.2]" />
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Ads slot */}
          <AdsPlaceholder position="sidebar" />
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* BLOCO FINAL OBRIGATÓRIO: "Dicionário Corporativo" com Barra de Pesquisa e Links */}
      {/* ========================================================================= */}
      <section 
        className="bg-[#111C31] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 md:p-10 space-y-8 mt-12 shadow-xl"
        id="bloco-dicionario-corporativo"
      >
        <div className="border-b border-white/[0.08] pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#00C2A8]/10 text-[#00C2A8] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#00C2A8]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ferramenta Integrada de Busca</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Dicionário Corporativo
          </h2>
          <p className="text-sm text-[#B6C2D0] max-w-3xl">
            Pesquise abaixo qualquer outra sigla, termo, cargo ou metodologia empresarial. Explore nossos termos interligados e continue aprendendo sobre a linguagem dos negócios.
          </p>
        </div>

        {/* Barra de Pesquisa Reutilizada Exatamente como na Home */}
        <CorporateDictionary navigate={navigate} />

        {/* Links Internos Interligados: Siglas, Termos, Categorias e Artigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          
          {/* 1. Siglas Relacionadas */}
          <div className="bg-[#0D1628] border border-white/[0.06] rounded-[18px] p-5 space-y-3">
            <h3 className="font-display font-extrabold text-sm text-[#00C2A8] flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span>Siglas Relacionadas</span>
              <Tag className="w-4 h-4 text-[#00C2A8]" />
            </h3>
            <div className="space-y-2">
              {related.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(getItemUrl(item))}
                  className="w-full text-left p-2.5 bg-[#111C31] hover:bg-[#162540] border border-white/[0.05] rounded-xl transition-all group block"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-xs text-white group-hover:text-[#00C2A8]">{item.sigla}</span>
                    <span className="text-[10px] text-[#7C8AA5] font-mono">{item.categoria}</span>
                  </div>
                  <p className="text-[11px] text-[#B6C2D0] line-clamp-1 mt-0.5">{item.nome_completo}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Termos Relacionados */}
          <div className="bg-[#0D1628] border border-white/[0.06] rounded-[18px] p-5 space-y-3">
            <h3 className="font-display font-extrabold text-sm text-[#3B82F6] flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span>Termos Relacionados</span>
              <BookOpen className="w-4 h-4 text-[#3B82F6]" />
            </h3>
            <div className="space-y-2">
              {relatedTerms.map((term) => (
                <button
                  key={term.id}
                  onClick={() => navigate(getItemUrl(term))}
                  className="w-full text-left p-2.5 bg-[#111C31] hover:bg-[#162540] border border-white/[0.05] rounded-xl transition-all group block"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-xs text-white group-hover:text-[#3B82F6]">{term.sigla}</span>
                    <span className="text-[9px] text-[#7C8AA5] uppercase">{term.tipo || "TERMO"}</span>
                  </div>
                  <p className="text-[11px] text-[#B6C2D0] line-clamp-1 mt-0.5">{term.nome_completo}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Categorias Relacionadas */}
          <div className="bg-[#0D1628] border border-white/[0.06] rounded-[18px] p-5 space-y-3">
            <h3 className="font-display font-extrabold text-sm text-[#F59E0B] flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span>Categorias Relacionadas</span>
              <Layers className="w-4 h-4 text-[#F59E0B]" />
            </h3>
            <div className="space-y-1.5">
              {[
                { name: "Marketing", path: "/siglas-marketing" },
                { name: "Recursos Humanos", path: "/siglas-rh" },
                { name: "Financeiro", path: "/siglas-financeiras" },
                { name: "Tecnologia", path: "/siglas-tecnologia" },
                { name: "Vendas", path: "/siglas-vendas" },
                { name: "Logística", path: "/siglas-logistica" },
                { name: "Gestão", path: "/siglas-gestao" },
                { name: "Ver Todas as Siglas", path: "/" }
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => navigate(c.path)}
                  className="w-full text-left px-3 py-2 bg-[#111C31] hover:bg-[#162540] border border-white/[0.05] rounded-xl transition-all text-xs text-[#B6C2D0] hover:text-[#00C2A8] font-medium flex items-center justify-between"
                >
                  <span>{c.name}</span>
                  <ChevronRight className="w-3 h-3 text-white/30" />
                </button>
              ))}
            </div>
          </div>

          {/* 4. Artigos Relacionados */}
          <div className="bg-[#0D1628] border border-white/[0.06] rounded-[18px] p-5 space-y-3">
            <h3 className="font-display font-extrabold text-sm text-[#10B981] flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span>Artigos Relacionados</span>
              <Compass className="w-4 h-4 text-[#10B981]" />
            </h3>
            <div className="space-y-2">
              {relatedPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="w-full text-left p-2.5 bg-[#111C31] hover:bg-[#162540] border border-white/[0.05] rounded-xl transition-all group block"
                >
                  <p className="font-bold text-xs text-[#B6C2D0] group-hover:text-[#10B981] line-clamp-2">
                    {post.titulo}
                  </p>
                  <span className="text-[10px] text-[#7C8AA5] uppercase font-mono mt-1 block">
                    {post.categoria}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Ads footer bar */}
      <AdsPlaceholder position="footer" />
    </div>
  );
}

