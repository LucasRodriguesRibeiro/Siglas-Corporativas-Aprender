import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Calendar, 
  Share2, 
  Check, 
  User, 
  Heart, 
  Eye, 
  Sparkles,
  Twitter,
  Linkedin
} from "lucide-react";
import { BlogArticle } from "../types";
import AdsPlaceholder from "../components/AdsPlaceholder";
import { BlogCardSkeleton } from "../components/Skeleton";
import { getBlogArticles, getBlogArticleBySlug } from "../data/dataService";

interface BlogViewProps {
  articleSlug?: string;
  navigate: (to: string) => void;
}

export default function BlogView({ articleSlug, navigate }: BlogViewProps) {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Load appropriate data
  useEffect(() => {
    function loadBlogData() {
      try {
        setLoading(true);
        setError(false);

        if (articleSlug) {
          // Load specific article locally
          const data = getBlogArticleBySlug(articleSlug);
          if (!data) {
            setError(true);
            setLoading(false);
            return;
          }
          setArticle(data);
          
          // Seed initial Likes count randomly
          setLikes(Math.floor(Math.random() * 40) + 12);
        } else {
          // Load list locally
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

  // A. Render single blog post view
  if (articleSlug && article) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 min-[360px]:px-6 md:px-8 w-full py-8 space-y-10 bg-[#07111F]">
        {/* Breadcrumb / Navigation */}
        <nav className="flex items-center justify-between border-b border-white/[0.08] pb-4 text-xs">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center space-x-1.5 font-bold text-[#B6C2D0] hover:text-[#00C2A8] transition-colors py-1.5 px-3 bg-[#111C31] border border-white/[0.08] rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para o blog</span>
          </button>
          
          <div className="flex items-center space-x-1 font-bold text-[11px] uppercase tracking-wider text-[#7C8AA5] hidden sm:flex">
            <button onClick={() => navigate("/")} className="hover:text-white">Início</button>
            <ChevronRight className="w-3 h-3 text-white/[0.2]" />
            <button onClick={() => navigate("/blog")} className="hover:text-white">Blog</button>
            <ChevronRight className="w-3 h-3 text-white/[0.2]" />
            <span className="text-[#00C2A8] truncate max-w-[200px]">{article.titulo}</span>
          </div>
        </nav>

        {/* Ads top */}
        <AdsPlaceholder position="top" />

        {/* Article Body Container */}
        <article className="space-y-8 bg-[#111C31] p-5 sm:p-8 md:p-10 border border-white/[0.08] rounded-[20px] shadow-lg">
          {/* Metadata header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#B6C2D0]">
              <span className="px-3 py-1 bg-[#0D1628] text-[#00C2A8] rounded-full border border-white/[0.05] uppercase tracking-widest text-[9px]">
                {article.categoria}
              </span>
              <span className="flex items-center text-[#7C8AA5]"><Clock className="w-3.5 h-3.5 mr-1 text-[#00C2A8]" /> {article.tempo_leitura}</span>
              <span className="flex items-center text-[#7C8AA5]"><Calendar className="w-3.5 h-3.5 mr-1 text-[#00C2A8]" /> {article.data}</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              {article.titulo}
            </h1>

            <p className="text-base sm:text-lg text-[#B6C2D0] font-medium leading-relaxed">
              {article.descricao}
            </p>

            <div className="flex items-center space-x-3 py-4 border-y border-white/[0.06]">
              <div className="w-9 h-9 rounded-full bg-[#0D1628] border border-white/[0.05] flex items-center justify-center text-sm font-bold font-mono text-[#00C2A8]">
                {article.autor.charAt(0)}
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">{article.autor}</span>
                <span className="text-[#7C8AA5] block mt-0.5">Autor Especialista de Linguagem Empresarial</span>
              </div>
            </div>
          </div>

          {/* Render Markdown-like content safely with premium classes */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-[#B6C2D0] leading-relaxed text-sm sm:text-base space-y-6">
            {article.conteudo.split("\n\n").map((paragraph, idx) => {
              // Simple markup check for headers
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={idx} className="font-display font-extrabold text-lg sm:text-xl text-white pt-4">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                    {paragraph.split("\n").map((li, liIdx) => (
                      <li key={liIdx} className="text-[#B6C2D0]">
                        {li.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
                      </li>
                    ))}
                  </ul>
                );
              }
              // Simple bold formatting replacement helper
              const formattedText = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
              return (
                <p 
                  key={idx} 
                  dangerouslySetInnerHTML={{ __html: formattedText }} 
                  className="leading-relaxed text-[#B6C2D0]"
                />
              );
            })}
          </div>

          {/* Interactive footer (Likes, Shares) */}
          <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between">
            {/* Likes Toggler */}
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-250 flex items-center space-x-1.5 ${
                hasLiked
                  ? "bg-[#00C2A8]/10 border-[#00C2A8]/35 text-[#00C2A8]"
                  : "bg-[#0D1628] border-white/[0.08] text-[#B6C2D0] hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? "fill-current text-[#00C2A8]" : ""}`} />
              <span>Gostei ({likes})</span>
            </button>

            {/* Shares panel */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="p-2.5 bg-[#0D1628] border border-white/[0.08] text-[#B6C2D0] hover:text-white rounded-xl transition-all"
                title="Copiar Link do Post"
              >
                {copiedLink ? <Check className="w-4.5 h-4.5 text-[#10B981]" /> : <Share2 className="w-4.5 h-4.5" />}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=Confira o post "${article.titulo}" no Dicionário Corporativo: ${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0D1628] border border-white/[0.08] text-[#3B82F6] hover:bg-white/[0.02] rounded-xl transition-all"
                title="Compartilhar no Twitter"
              >
                <Twitter className="w-4.5 h-4.5 fill-current" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0D1628] border border-white/[0.08] text-[#3B82F6] hover:bg-white/[0.02] rounded-xl transition-all"
                title="Compartilhar no LinkedIn"
              >
                <Linkedin className="w-4.5 h-4.5 fill-current" />
              </a>
            </div>
          </div>
        </article>

        {/* Ads inline */}
        <AdsPlaceholder position="content" />

        {/* Bottom footer button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-3 bg-[#00C2A8] hover:bg-[#00D8BB] text-[#07111F] font-extrabold rounded-xl transition-all duration-250 shadow-md"
          >
            Ver Outros Artigos
          </button>
        </div>
      </div>
    );
  }

  // B. Render main blog listing page
  return (
    <div className="max-w-[1280px] mx-auto px-5 min-[360px]:px-6 md:px-8 w-full py-8 space-y-12 bg-[#07111F]">
      {/* Blog header section */}
      <section className="text-center max-w-2xl mx-auto space-y-4 py-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#111C31] border border-white/[0.08] text-[#00C2A8]">
          <BookOpen className="w-3.5 h-3.5 mr-1 text-[#00C2A8]" />
          Dicionário Corporativo Blog
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
          Educação e Artigos de Carreira
        </h1>
        <p className="text-sm sm:text-base text-[#B6C2D0] font-medium leading-relaxed">
          Domine a retórica empresarial! Explore nossos guias aprofundados sobre processos de negócios, metodologias ágeis e vocabulário profissional para liderar reuniões de alta gerência.
        </p>
      </section>

      {/* Ads top */}
      <AdsPlaceholder position="top" />

      {/* Articles Grid list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      ) : articles.length === 0 ? (
        <div className="p-12 text-center bg-[#111C31] border border-white/[0.08] rounded-[20px]">
          <p className="text-[#B6C2D0] font-medium">Nenhum artigo publicado no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/blog/${item.slug}`)}
              className="bg-[#111C31] border border-white/[0.08] hover:bg-[#162540] hover:scale-102 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] shadow-md rounded-[20px] p-5 sm:p-6 space-y-4 transition-all duration-250 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-semibold text-[#7C8AA5] uppercase tracking-wider">
                  <span className="px-2.5 py-0.5 bg-[#0D1628] rounded-full border border-white/[0.05] text-[#00C2A8]">
                    {item.categoria}
                  </span>
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {item.tempo_leitura}</span>
                </div>
                
                <h3 className="font-display font-extrabold text-lg text-white line-clamp-2 leading-tight group-hover:text-[#00C2A8] transition-colors">
                  {item.titulo}
                </h3>
                
                <p className="text-xs text-[#B6C2D0] line-clamp-3 leading-relaxed">
                  {item.descricao}
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
                <span className="text-[10px] font-bold text-[#00C2A8] ml-auto flex items-center group-hover:translate-x-1 transition-transform">
                  Ler artigo <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ads footer */}
      <AdsPlaceholder position="footer" />
    </div>
  );
}
