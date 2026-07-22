import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Calendar, 
  Share2, 
  Check, 
  Heart, 
  Twitter,
  Linkedin,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Search,
  ExternalLink,
  Tag,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Layers
} from "lucide-react";
import { BlogArticle, Sigla } from "../types";
import AdsPlaceholder from "../components/AdsPlaceholder";
import { BlogCardSkeleton } from "../components/Skeleton";
import { getBlogArticles, getBlogArticleBySlug, getAllSiglas } from "../data/dataService";

interface BlogViewProps {
  articleSlug?: string;
  navigate: (to: string) => void;
}

export default function BlogView({ articleSlug, navigate }: BlogViewProps) {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [allSiglas, setAllSiglas] = useState<Sigla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    function loadBlogData() {
      try {
        setLoading(true);
        setError(false);
        const sigList = getAllSiglas();
        setAllSiglas(sigList);

        if (articleSlug) {
          const data = getBlogArticleBySlug(articleSlug);
          if (!data) {
            setError(true);
            setLoading(false);
            return;
          }
          setArticle(data);
          setLikes(Math.floor(Math.random() * 40) + 18);
        } else {
          const data = getBlogArticles();
          setArticles(data);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do blog:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadBlogData();
  }, [articleSlug]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function handleLike() {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  }

  // Related articles exclude current
  const allArticlesList = getBlogArticles();
  const relatedArticles = article 
    ? allArticlesList.filter(a => a.id !== article.id).slice(0, 3) 
    : [];

  // Related siglas cards logic
  const relatedSiglasList = article
    ? allSiglas.filter(s => {
        const isMatchBySlug = article.siglas_relacionadas_slugs?.includes(s.slug.toLowerCase());
        const isMatchByTag = s.tags.some(t => article.tags.includes(t.toLowerCase()));
        return isMatchBySlug || isMatchByTag;
      }).slice(0, 8)
    : [];

  // 5 related siglas for CTA secundario
  const ctaSiglas = allSiglas.filter(s => s.tipo === 'SIGLA' || !s.tipo).slice(0, 5);
  // 5 corporate terms for CTA secundario
  const ctaTermos = allSiglas.filter(s => s.tipo === 'TERMO' || s.tipo === 'CONCEITO' || s.tipo === 'METODOLOGIA').slice(0, 5);
  // 5 articles for CTA secundario
  const ctaArtigos = allArticlesList.slice(0, 5);

  // A. Render single blog post view
  if (articleSlug && article) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 min-[360px]:px-6 md:px-8 w-full py-8 space-y-10 bg-[#07111F]">
        {/* Breadcrumb / Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4 text-xs">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center space-x-1.5 font-bold text-[#B6C2D0] hover:text-[#00C2A8] transition-colors py-1.5 px-3 bg-[#111C31] border border-white/[0.08] rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para o Blog</span>
          </button>
          
          <div className="flex items-center space-x-1 font-bold text-[11px] uppercase tracking-wider text-[#7C8AA5] hidden sm:flex">
            <button onClick={() => navigate("/")} className="hover:text-white">Início</button>
            <ChevronRight className="w-3 h-3 text-white/[0.2]" />
            <button onClick={() => navigate("/blog")} className="hover:text-white">Blog</button>
            <ChevronRight className="w-3 h-3 text-white/[0.2]" />
            <span className="text-[#00C2A8] truncate max-w-[240px]">{article.titulo}</span>
          </div>
        </nav>

        {/* Ads top */}
        <AdsPlaceholder position="top" />

        {/* Main Article Container */}
        <article className="space-y-12 bg-[#111C31] p-5 sm:p-8 md:p-10 border border-white/[0.08] rounded-[24px] shadow-xl">
          
          {/* 1. HERO SECTION */}
          <header className="space-y-6 border-b border-white/[0.08] pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#B6C2D0]">
              <span className="px-3.5 py-1 bg-[#00C2A8]/10 text-[#00C2A8] rounded-full border border-[#00C2A8]/30 uppercase tracking-widest text-[10px] font-bold">
                {article.categoria}
              </span>
              <span className="flex items-center text-[#7C8AA5]">
                <Clock className="w-3.5 h-3.5 mr-1 text-[#00C2A8]" /> {article.tempo_leitura}
              </span>
              <span className="flex items-center text-[#7C8AA5]">
                <Calendar className="w-3.5 h-3.5 mr-1 text-[#00C2A8]" /> {article.data}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.15]">
              {article.titulo}
            </h1>

            <p className="text-base sm:text-lg text-[#B6C2D0] font-medium leading-relaxed max-w-4xl">
              {article.subtitulo || article.descricao}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#0D1628] border border-white/[0.1] flex items-center justify-center text-sm font-bold font-mono text-[#00C2A8]">
                {article.autor.charAt(0)}
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">{article.autor}</span>
                <span className="text-[#7C8AA5] block mt-0.5">Especialista em Linguagem Corporativa e Gestão</span>
              </div>
            </div>
          </header>

          {/* 2. INTRODUÇÃO DIRETA (Resposta Imediata à Dúvida do Usuário) */}
          <section className="bg-gradient-to-r from-[#0D1628] to-[#14233D] p-6 sm:p-8 rounded-[20px] border border-[#00C2A8]/30 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C2A8]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center space-x-2 text-[#00C2A8] font-bold text-xs uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-[#00C2A8]" />
              <span>Resumo Direto</span>
            </div>
            <p className="text-base sm:text-lg text-white font-semibold leading-relaxed">
              {article.introducao_direta || article.descricao}
            </p>
          </section>

          {/* 3. EXPLICAÇÃO COMPLETA */}
          <section className="space-y-8">
            <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
              <BookOpen className="w-5 h-5 text-[#00C2A8]" />
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Explicação Completa e Conceito
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Significado */}
              <div className="p-6 bg-[#0D1628] border border-white/[0.06] rounded-[18px] space-y-3">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                  <span>O que significa exatamente?</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#B6C2D0] leading-relaxed">
                  {article.explicacao?.significado}
                </p>
              </div>

              {/* Origem */}
              <div className="p-6 bg-[#0D1628] border border-white/[0.06] rounded-[18px] space-y-3">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                  <span>Origem e História</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#B6C2D0] leading-relaxed">
                  {article.explicacao?.origem}
                </p>
              </div>
            </div>

            {/* Onde é utilizado */}
            <div className="p-6 bg-[#0D1628] border border-white/[0.06] rounded-[18px] space-y-3">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                <span>Onde é utilizado no Mercado Corporativo?</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#B6C2D0] leading-relaxed">
                {article.explicacao?.onde_utilizado}
              </p>
            </div>

            {/* Vantagens & Cuidados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vantagens */}
              <div className="p-6 bg-[#0D1628] border border-emerald-500/20 rounded-[18px] space-y-4">
                <h3 className="font-bold text-emerald-400 text-base flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Principais Vantagens</span>
                </h3>
                <ul className="space-y-2.5">
                  {article.explicacao?.vantagens?.map((v, i) => (
                    <li key={i} className="text-xs text-[#B6C2D0] flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cuidados */}
              <div className="p-6 bg-[#0D1628] border border-amber-500/20 rounded-[18px] space-y-4">
                <h3 className="font-bold text-amber-400 text-base flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Cuidados Importantes</span>
                </h3>
                <ul className="space-y-2.5">
                  {article.explicacao?.cuidados?.map((c, i) => (
                    <li key={i} className="text-xs text-[#B6C2D0] flex items-start space-x-2">
                      <span className="text-amber-400 font-bold mt-0.5">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Curiosidades */}
            {article.explicacao?.curiosidades && article.explicacao.curiosidades.length > 0 && (
              <div className="p-6 bg-[#0D1628] border border-white/[0.06] rounded-[18px] space-y-3">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-[#00C2A8]" />
                  <span>Curiosidades do Mercado</span>
                </h3>
                <ul className="space-y-2">
                  {article.explicacao.curiosidades.map((cur, i) => (
                    <li key={i} className="text-xs text-[#B6C2D0] flex items-start space-x-2">
                      <span className="text-[#00C2A8] font-bold">•</span>
                      <span>{cur}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* 4. EXEMPLOS PRÁTICOS */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
              <Sparkles className="w-5 h-5 text-[#00C2A8]" />
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Exemplos Práticos de Utilização
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.exemplos_praticos?.map((ex, idx) => (
                <div key={idx} className="p-5 bg-[#0D1628] border border-white/[0.06] rounded-[16px] space-y-2">
                  <span className="text-[10px] font-mono text-[#00C2A8] uppercase tracking-wider font-bold">
                    Cenário Prático #{idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-[#B6C2D0] leading-relaxed">
                    {ex}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. QUANDO UTILIZAR */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
              <Clock className="w-5 h-5 text-[#00C2A8]" />
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Quando Utilizar no Dia a Dia?
              </h2>
            </div>

            <div className="p-6 bg-[#0D1628] border border-white/[0.06] rounded-[18px] space-y-3">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {article.quando_utilizar?.map((item, idx) => (
                  <li key={idx} className="p-3.5 bg-[#111C31] rounded-xl text-xs text-[#B6C2D0] flex items-start space-x-2 border border-white/[0.04]">
                    <span className="text-[#00C2A8] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 6. ERROS COMUNS */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Erros Comuns e Como Evitá-los
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.erros_comuns?.map((item, idx) => (
                <div key={idx} className="p-5 bg-[#0D1628] border border-rose-500/20 rounded-[16px] space-y-2">
                  <h3 className="font-bold text-rose-400 text-sm flex items-center space-x-2">
                    <span>⚠️ {item.erro}</span>
                  </h3>
                  <p className="text-xs text-[#B6C2D0] leading-relaxed">
                    {item.explicacao}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. PERGUNTAS FREQUENTES (FAQ) - Pelo menos 8 FAQs */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
              <HelpCircle className="w-5 h-5 text-[#00C2A8]" />
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Perguntas Frequentes (FAQ)
              </h2>
            </div>

            <div className="space-y-3">
              {article.faqs?.map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-[#0D1628] border border-white/[0.06] rounded-[16px] overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex justify-between items-center space-x-4 hover:bg-white/[0.02]"
                    >
                      <span className="font-bold text-sm sm:text-base text-white">
                        {faq.pergunta}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#00C2A8] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#7C8AA5] shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-5 pt-1 sm:px-5 border-t border-white/[0.04]">
                        <p className="text-xs sm:text-sm text-[#B6C2D0] leading-relaxed">
                          {faq.resposta}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 8. CONTEÚDOS RELACIONADOS (Outros Artigos) */}
          <section className="space-y-6 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#00C2A8]" />
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Conteúdos Relacionados
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/blog/${rel.slug}`)}
                  className="bg-[#0D1628] border border-white/[0.08] hover:bg-[#14233D] rounded-[16px] p-5 space-y-3 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-[#00C2A8] uppercase tracking-wider block">
                      {rel.categoria}
                    </span>
                    <h3 className="font-bold text-sm text-white group-hover:text-[#00C2A8] transition-colors line-clamp-2">
                      {rel.titulo}
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#7C8AA5] font-semibold flex items-center pt-2">
                    Ler artigo <ChevronRight className="w-3 h-3 ml-1 text-[#00C2A8]" />
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 9. SIGLAS RELACIONADAS */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
              <Tag className="w-5 h-5 text-[#00C2A8]" />
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Siglas e Termos Relacionados
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedSiglasList.map((sig) => {
                const t = sig.tipo?.toLowerCase() || 'sigla';
                return (
                  <button
                    key={sig.id}
                    onClick={() => navigate(`/${t}/${sig.slug}`)}
                    className="p-3 bg-[#0D1628] hover:bg-[#00C2A8]/10 border border-white/[0.08] hover:border-[#00C2A8]/40 rounded-xl text-left transition-all space-y-1 group"
                  >
                    <span className="font-mono font-extrabold text-sm text-white group-hover:text-[#00C2A8] block">
                      {sig.sigla}
                    </span>
                    <span className="text-[10px] text-[#7C8AA5] truncate block">
                      {sig.nome_completo}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 10. CTA PARA O DICIONÁRIO (Bloco de Destaque Obrigatório) */}
          <section className="p-8 sm:p-10 bg-gradient-to-br from-[#0D1628] via-[#11223B] to-[#0A182E] border-2 border-[#00C2A8]/40 rounded-[24px] text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#00C2A8]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="text-3xl block">🔍</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                🔍 Continue aprendendo
              </h2>
              <p className="text-sm sm:text-base text-[#B6C2D0] leading-relaxed">
                Pesquise gratuitamente centenas de siglas, termos empresariais, cargos e metodologias no Dicionário de Siglas Corporativas.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-4 bg-[#00C2A8] hover:bg-[#00D8BB] text-[#07111F] font-extrabold text-base rounded-xl transition-all shadow-lg hover:scale-105 inline-flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Ir para o Dicionário</span>
                </button>
              </div>
            </div>
          </section>

          {/* 11. CTA SECUNDÁRIO (Continue Aprendendo) */}
          <section className="space-y-8 pt-6 border-t border-white/[0.08]">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00C2A8]">
                Explore mais conteúdos
              </span>
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Continue Aprendendo
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 5 Siglas Relacionadas */}
              <div className="p-5 bg-[#0D1628] border border-white/[0.06] rounded-[20px] space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2 border-b border-white/[0.06] pb-3">
                  <Bookmark className="w-4 h-4 text-[#00C2A8]" />
                  <span>5 Siglas Recomendadas</span>
                </h3>
                <div className="space-y-2">
                  {ctaSiglas.map(s => (
                    <button
                      key={s.id}
                      onClick={() => navigate(`/${s.tipo?.toLowerCase() || 'sigla'}/${s.slug}`)}
                      className="w-full p-2.5 bg-[#111C31] hover:bg-[#162540] border border-white/[0.04] rounded-xl flex items-center justify-between text-left text-xs transition-all group"
                    >
                      <span className="font-mono font-bold text-white group-hover:text-[#00C2A8]">{s.sigla}</span>
                      <span className="text-[10px] text-[#7C8AA5] truncate max-w-[110px]">{s.nome_completo}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5 Termos Corporativos */}
              <div className="p-5 bg-[#0D1628] border border-white/[0.06] rounded-[20px] space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2 border-b border-white/[0.06] pb-3">
                  <Tag className="w-4 h-4 text-[#00C2A8]" />
                  <span>5 Termos Corporativos</span>
                </h3>
                <div className="space-y-2">
                  {ctaTermos.map(s => (
                    <button
                      key={s.id}
                      onClick={() => navigate(`/${s.tipo?.toLowerCase() || 'termo'}/${s.slug}`)}
                      className="w-full p-2.5 bg-[#111C31] hover:bg-[#162540] border border-white/[0.04] rounded-xl flex items-center justify-between text-left text-xs transition-all group"
                    >
                      <span className="font-bold text-white group-hover:text-[#00C2A8]">{s.sigla}</span>
                      <span className="text-[10px] text-[#7C8AA5] truncate max-w-[110px]">{s.nome_completo}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5 Artigos */}
              <div className="p-5 bg-[#0D1628] border border-white/[0.06] rounded-[20px] space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2 border-b border-white/[0.06] pb-3">
                  <BookOpen className="w-4 h-4 text-[#00C2A8]" />
                  <span>5 Artigos Principais</span>
                </h3>
                <div className="space-y-2">
                  {ctaArtigos.map(a => (
                    <button
                      key={a.id}
                      onClick={() => navigate(`/blog/${a.slug}`)}
                      className="w-full p-2.5 bg-[#111C31] hover:bg-[#162540] border border-white/[0.04] rounded-xl flex items-center justify-between text-left text-xs transition-all group"
                    >
                      <span className="font-medium text-[#B6C2D0] group-hover:text-[#00C2A8] truncate pr-2">{a.titulo}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#7C8AA5] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 5 Categorias */}
              <div className="p-5 bg-[#0D1628] border border-white/[0.06] rounded-[20px] space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2 border-b border-white/[0.06] pb-3">
                  <Layers className="w-4 h-4 text-[#00C2A8]" />
                  <span>5 Categorias Principais</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "Marketing", path: "/siglas-marketing" },
                    { name: "Recursos Humanos", path: "/siglas-rh" },
                    { name: "Financeiro", path: "/siglas-financeiras" },
                    { name: "Tecnologia", path: "/siglas-tecnologia" },
                    { name: "Vendas", path: "/siglas-vendas" }
                  ].map(cat => (
                    <button
                      key={cat.path}
                      onClick={() => navigate(cat.path)}
                      className="w-full p-2.5 bg-[#111C31] hover:bg-[#162540] border border-white/[0.04] rounded-xl flex items-center justify-between text-left text-xs transition-all group"
                    >
                      <span className="font-bold text-[#B6C2D0] group-hover:text-[#00C2A8]">{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#7C8AA5] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Article Footer Toolbar (Likes, Shares) */}
          <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                hasLiked
                  ? "bg-[#00C2A8]/10 border-[#00C2A8]/35 text-[#00C2A8]"
                  : "bg-[#0D1628] border-white/[0.08] text-[#B6C2D0] hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? "fill-current text-[#00C2A8]" : ""}`} />
              <span>Gostei ({likes})</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="p-2.5 bg-[#0D1628] border border-white/[0.08] text-[#B6C2D0] hover:text-white rounded-xl transition-all"
                title="Copiar Link do Post"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#10B981]" /> : <Share2 className="w-4 h-4" />}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.titulo)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0D1628] border border-white/[0.08] text-[#3B82F6] hover:bg-white/[0.02] rounded-xl transition-all"
                title="Compartilhar no Twitter"
              >
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0D1628] border border-white/[0.08] text-[#3B82F6] hover:bg-white/[0.02] rounded-xl transition-all"
                title="Compartilhar no LinkedIn"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>
        </article>

        {/* Ads inline */}
        <AdsPlaceholder position="content" />

        <div className="text-center pt-4">
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-3 bg-[#00C2A8] hover:bg-[#00D8BB] text-[#07111F] font-extrabold rounded-xl transition-all shadow-md"
          >
            Ver Todos os Artigos do Blog
          </button>
        </div>
      </div>
    );
  }

  // B. Render Main Blog Listing View
  return (
    <div className="max-w-[1280px] mx-auto px-5 min-[360px]:px-6 md:px-8 w-full py-8 space-y-12 bg-[#07111F]">
      {/* Blog header */}
      <section className="text-center max-w-3xl mx-auto space-y-4 py-6">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-[#111C31] border border-white/[0.08] text-[#00C2A8]">
          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#00C2A8]" />
          Blog Dicionário Corporativo
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
          Artigos, Metodologias e Guia de Carreira
        </h1>
        <p className="text-sm sm:text-base text-[#B6C2D0] font-medium leading-relaxed">
          Aprenda o significado de siglas corporativas, metodologias ágeis, cargos empresariais e termos de negócios para liderar conversas com clareza e autoridade.
        </p>
      </section>

      {/* Ads top */}
      <AdsPlaceholder position="top" />

      {/* Blog Articles List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      ) : articles.length === 0 ? (
        <div className="p-12 text-center bg-[#111C31] border border-white/[0.08] rounded-[20px]">
          <p className="text-[#B6C2D0] font-medium">Nenhum artigo publicado no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/blog/${item.slug}`)}
              className="bg-[#111C31] border border-white/[0.08] hover:bg-[#162540] hover:border-[#00C2A8]/30 shadow-md rounded-[24px] p-6 space-y-4 transition-all duration-250 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-semibold text-[#7C8AA5] uppercase tracking-wider">
                  <span className="px-2.5 py-0.5 bg-[#0D1628] rounded-full border border-white/[0.05] text-[#00C2A8] font-bold">
                    {item.categoria}
                  </span>
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-[#00C2A8]" /> {item.tempo_leitura}</span>
                </div>
                
                <h2 className="font-display font-extrabold text-lg text-white line-clamp-2 leading-tight group-hover:text-[#00C2A8] transition-colors">
                  {item.titulo}
                </h2>
                
                <p className="text-xs text-[#B6C2D0] line-clamp-3 leading-relaxed">
                  {item.subtitulo || item.descricao}
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-4 mt-4 border-t border-white/[0.06]">
                <div className="w-7 h-7 rounded-full bg-[#0D1628] border border-white/[0.05] flex items-center justify-center text-[11px] font-bold text-[#00C2A8] font-mono">
                  {item.autor.charAt(0)}
                </div>
                <div className="text-[11px]">
                  <span className="font-semibold text-white block leading-none mb-0.5">{item.autor.split(",")[0]}</span>
                  <span className="text-[#7C8AA5] block text-[9px]">{item.data}</span>
                </div>
                <span className="text-[11px] font-bold text-[#00C2A8] ml-auto flex items-center group-hover:translate-x-1 transition-transform">
                  Ler artigo <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA para a busca da Homepage na lista do Blog */}
      <section className="p-8 bg-[#111C31] border border-white/[0.08] rounded-[24px] text-center space-y-4">
        <h2 className="font-display font-extrabold text-xl text-white">
          Procurando uma sigla específica?
        </h2>
        <p className="text-xs sm:text-sm text-[#B6C2D0] max-w-xl mx-auto">
          Consulte gratuitamente centenas de siglas, termos empresariais, cargos, metodologias e ferramentas no nosso dicionário.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-[#00C2A8] hover:bg-[#00D8BB] text-[#07111F] font-bold text-sm rounded-xl transition-all"
        >
          Acessar Dicionário Gratuito
        </button>
      </section>

      {/* Ads footer */}
      <AdsPlaceholder position="footer" />
    </div>
  );
}
