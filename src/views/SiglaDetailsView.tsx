import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
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
  BookmarkCheck,
  Twitter,
  Linkedin
} from "lucide-react";
import { Sigla } from "../types";
import AdsPlaceholder from "../components/AdsPlaceholder";

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
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Action status indicators
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMeaning, setCopiedMeaning] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Load selected sigla data
  useEffect(() => {
    async function loadSigla() {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/siglas/slug/${slug.toLowerCase()}`);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setSigla(data);

        // Fetch related siglas by category (same category, excluding the current one)
        const allRes = await fetch(`/api/siglas?category=${encodeURIComponent(data.categoria)}`);
        if (allRes.ok) {
          const allData: Sigla[] = await allRes.json();
          setRelated(allData.filter(item => item.id !== data.id).slice(0, 4));
        }

        // Fetch related blog articles
        const blogRes = await fetch("/api/blog");
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          // Pick articles that match this category
          const filteredBlog = blogData.filter((post: any) => 
            post.categoria.toLowerCase() === data.categoria.toLowerCase()
          ).slice(0, 2);

          if (filteredBlog.length < 2) {
            const otherBlog = blogData.filter((post: any) => 
              post.categoria.toLowerCase() !== data.categoria.toLowerCase()
            );
            setRelatedPosts([...filteredBlog, ...otherBlog].slice(0, 2));
          } else {
            setRelatedPosts(filteredBlog);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar sigla:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadSigla();
  }, [slug]);

  // Handle Share URL Copy
  function handleCopyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  // Handle Copy Meaning
  function handleCopyMeaning() {
    if (!sigla) return;
    const text = `Significado de ${sigla.sigla}: ${sigla.nome_completo}.\n${sigla.descricao_curta}\nExemplo: "${sigla.exemplo}"\nSaiba mais em: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopiedMeaning(true);
    setTimeout(() => setCopiedMeaning(false), 2000);
  }

  // Play pronunciation via browser Text-to-Speech (native web SpeechSynthesis)
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
          <h2 className="font-display font-extrabold text-2xl text-white">Sigla Não Encontrada</h2>
          <p className="text-sm text-[#B6C2D0]">
            A sigla ou URL informada não pôde ser localizada no banco de dados do dicionário corporativo.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-[#00C2A8] hover:bg-[#00D8BB] text-[#07111F] font-bold rounded-xl transition-all duration-250 shadow-md"
        >
          Voltar para a Home
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(sigla.id);

  return (
    <div className="max-w-[1280px] mx-auto px-5 min-[360px]:px-6 md:px-8 w-full py-8 space-y-10 bg-[#07111F]">
      {/* 1. Breadcrumbs & Top Navigation Button */}
      <nav className="flex items-center justify-between border-b border-white/[0.08] pb-4 text-xs font-medium text-[#7C8AA5]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-1.5 text-[#B6C2D0] hover:text-[#00C2A8] transition-colors py-1.5 px-3 bg-[#111C31] border border-white/[0.08] rounded-xl"
          id="btn-back-home"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para busca</span>
        </button>

        <div className="flex items-center space-x-1.5 font-bold text-[11px] uppercase tracking-wider hidden sm:flex">
          <button onClick={() => navigate("/")} className="hover:text-white">Início</button>
          <ChevronRight className="w-3 h-3 text-white/[0.2]" />
          <span className="text-[#7C8AA5]">{sigla.categoria}</span>
          <ChevronRight className="w-3 h-3 text-white/[0.2]" />
          <span className="text-[#00C2A8]">{sigla.sigla}</span>
        </div>
      </nav>

      {/* Ads inline slot */}
      <AdsPlaceholder position="top" />

      {/* 2. Main content container split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Acronym main data card (Middle columns) */}
        <div className="lg:col-span-3 space-y-8" id="sigla-detail-body">
          {/* Header information card */}
          <div className="bg-[#111C31] p-5 sm:p-6 md:p-8 border border-white/[0.08] rounded-[20px] space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0D1628] text-[#00C2A8] border border-white/[0.05]">
                  Área: {sigla.categoria}
                </span>
                
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight flex items-center">
                  <span>{sigla.sigla}</span>
                  <button 
                    onClick={handlePlayPronunciation}
                    className={`ml-3 p-1.5 bg-[#0D1628] hover:bg-[#162540] border border-white/[0.08] rounded-xl transition-all ${audioPlayed ? "text-[#00C2A8] animate-bounce" : "text-[#7C8AA5] hover:text-[#00C2A8]"}`}
                    title="Ouvir pronúncia"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </h1>

                <p className="font-display font-extrabold text-lg sm:text-xl text-white">
                  {sigla.nome_completo}
                </p>
                {sigla.traducao && sigla.traducao !== "Não aplicável" && (
                  <p className="text-sm font-medium text-[#7C8AA5] italic">
                    Tradução em Português: <span className="font-semibold text-white">{sigla.traducao}</span>
                  </p>
                )}
              </div>

              {/* Action buttons (Share, Copy) */}
              <div className="flex items-center space-x-2 self-start shrink-0">
                <button
                  onClick={handleCopyMeaning}
                  className="p-2.5 bg-[#0D1628] border border-white/[0.08] text-[#B6C2D0] hover:text-white rounded-xl transition-all flex items-center space-x-1.5"
                  title="Copiar significado"
                >
                  {copiedMeaning ? <Check className="w-5 h-5 text-[#10B981]" /> : <Copy className="w-5 h-5" />}
                  <span className="text-xs font-bold hidden sm:inline">{copiedMeaning ? "Copiado!" : "Copiar"}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-2.5 bg-[#0D1628] border border-white/[0.08] text-[#B6C2D0] hover:text-white rounded-xl transition-all flex items-center space-x-1.5"
                  title="Compartilhar link"
                >
                  {copiedLink ? <Check className="w-5 h-5 text-[#10B981]" /> : <Share2 className="w-5 h-5" />}
                  <span className="text-xs font-bold hidden sm:inline">{copiedLink ? "Copiado!" : "Compartilhar"}</span>
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
          </div>

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
                  Use esta frase em reuniões e e-mails para demonstrar domínio técnico sobre {sigla.sigla}.
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
                    <strong className="text-white">Origem:</strong> {sigla.origem}
                  </li>
                  <li>
                    <strong className="text-white">Pronúncia figurada:</strong> {sigla.pronuncia}
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
                  <span>Contexto Histórico</span>
                </h3>
                <p className="text-xs text-[#B6C2D0] leading-relaxed">
                  {sigla.historia}
                </p>
              </div>
            </div>
          </div>

          {/* Content Ads Placeholder */}
          <AdsPlaceholder position="content" />

          {/* FAQ Accordion container */}
          <div className="space-y-6">
            <h2 className="font-display font-extrabold text-xl text-white border-b border-white/[0.06] pb-2">
              Perguntas Frequentes (FAQ)
            </h2>

            <div className="space-y-4">
              <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md space-y-2">
                <h4 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                  <HelpCircle className="w-4.5 h-4.5 text-[#00C2A8]" />
                  <span>Quando utilizar a sigla {sigla.sigla} na rotina empresarial?</span>
                </h4>
                <p className="text-xs text-[#B6C2D0] leading-relaxed pl-6.5">
                  A sigla {sigla.sigla} deve ser utilizada para mapear, reportar e analisar processos ligados à área de {sigla.categoria.toLowerCase()}. É ideal em apresentações de resultados trimestrais (QBR), definição de metas estratégicas e em discussões técnicas operacionais de alinhamento com a diretoria (C-Level).
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md space-y-2">
                <h4 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                  <HelpCircle className="w-4.5 h-4.5 text-[#00C2A8]" />
                  <span>Como explicar {sigla.sigla} de forma simples para um leigo?</span>
                </h4>
                <p className="text-xs text-[#B6C2D0] leading-relaxed pl-6.5">
                  Você pode explicar dizendo que {sigla.sigla} significa "{sigla.nome_completo}". Em termos simples: {sigla.descricao_curta}
                </p>
              </div>
            </div>
          </div>

          {/* Social media shares */}
          <div className="p-5 sm:p-6 bg-[#0D1628] rounded-[20px] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-white block">Achou útil o significado?</span>
              <span className="text-[10px] text-[#B6C2D0]">Compartilhe este conhecimento com outros colegas de trabalho!</span>
            </div>
            <div className="flex space-x-2">
              <a 
                href={`https://twitter.com/intent/tweet?text=Descubra o significado de ${sigla.sigla} - ${sigla.nome_completo} em: ${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#111C31] hover:bg-[#162540] border border-white/[0.08] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
              >
                <Twitter className="w-3.5 h-3.5 fill-current text-[#3B82F6]" />
                <span>Tweet</span>
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
                <span>Compartilhar</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related acronyms sidebar column */}
        <div className="space-y-6">
          <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8AA5] mb-4 flex items-center space-x-1.5">
              <Tag className="w-4 h-4 text-[#00C2A8]" />
              <span>Palavras-Chave / Tags</span>
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

          {/* Related siglas */}
          {related.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8AA5] flex items-center justify-between">
                <span>Siglas Relacionadas</span>
                <BookOpen className="w-3.5 h-3.5 text-[#00C2A8]" />
              </h3>

              <div className="space-y-3">
                {related.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/sigla/${item.slug}`)}
                    className="p-3 bg-[#0D1628] hover:bg-[#162540] border border-white/[0.05] rounded-xl transition-all cursor-pointer space-y-1 group"
                  >
                    <span className="font-display font-bold text-[#00C2A8] text-sm group-hover:underline">
                      {item.sigla}
                    </span>
                    <p className="text-xs font-medium text-white line-clamp-1">
                      {item.nome_completo}
                    </p>
                    <p className="text-[10px] text-[#B6C2D0] line-clamp-1">
                      {item.descricao_curta}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles block */}
          {relatedPosts.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8AA5] flex items-center justify-between">
                <span>Artigos Populares</span>
                <Compass className="w-3.5 h-3.5 text-[#00C2A8]" />
              </h3>
              <div className="space-y-3">
                {relatedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="p-3 bg-[#0D1628] hover:bg-[#162540] border border-white/[0.05] rounded-xl transition-all cursor-pointer space-y-1 group"
                  >
                    <span className="font-display font-bold text-[#B6C2D0] text-xs group-hover:text-[#00C2A8] line-clamp-2">
                      {post.titulo}
                    </span>
                    <span className="text-[9px] font-semibold text-[#7C8AA5] uppercase tracking-widest">
                      {post.categoria}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Quick Access block */}
          <div className="p-5 sm:p-6 bg-[#111C31] border border-white/[0.08] rounded-[20px] shadow-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8AA5] flex items-center justify-between">
              <span>Categorias de Siglas</span>
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
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[#B6C2D0] hover:bg-[#162540] hover:text-[#00C2A8] transition-colors font-medium flex items-center justify-between"
                >
                  <span>Siglas de {c.name}</span>
                  <ChevronRight className="w-3 h-3 text-white/[0.2]" />
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Ads slot */}
          <AdsPlaceholder position="sidebar" />
        </div>
      </div>

      {/* Ads footer bar */}
      <AdsPlaceholder position="footer" />
    </div>
  );
}
