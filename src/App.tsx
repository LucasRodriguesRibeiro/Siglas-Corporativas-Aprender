import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./views/HomeView";
import SiglaDetailsView from "./views/SiglaDetailsView";
import BlogView from "./views/BlogView";
import { getItemUrl } from "./types";
import { getFilteredSiglas } from "./data/dataService";

// Custom light-weight router hook to support back/forward buttons and server SPA interception
function usePath() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState(null, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { path, navigate };
}

// Custom 404 screen
function Custom404View({ navigate }: { navigate: (to: string) => void }) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
      <div className="text-8xl font-display font-extrabold text-teal-100 dark:text-slate-800 select-none">
        404
      </div>
      <div className="space-y-1.5">
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Página Não Encontrada</h2>
        <p className="text-sm text-slate-500 dark:text-slate-450">
          O termo, artigo ou recurso que você tentou acessar não foi localizado ou foi removido do nosso portal de siglas.
        </p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-sm"
      >
        Ir para Página Principal
      </button>
    </div>
  );
}

export default function App() {
  const { path, navigate } = usePath();

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  // Favorite Siglas (Bookmarked string IDs) State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Category (synchronized from home to footer)
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  
  // Toggle to filter search by favorites only
  const [showFavorites, setShowFavorites] = useState(false);

  // All siglas pre-loaded for printing as a clean book-format PDF
  const [allSiglas, setAllSiglas] = useState<any[]>([]);

  // Maps for SEO Friendly URL category routing
  const PATH_TO_CATEGORY: Record<string, string> = {
    "/siglas-marketing": "Marketing",
    "/siglas-rh": "Recursos Humanos",
    "/siglas-financeiras": "Financeiro",
    "/siglas-tecnologia": "Tecnologia",
    "/siglas-vendas": "Vendas",
    "/siglas-logistica": "Logística",
    "/siglas-gestao": "Gestão"
  };

  const CATEGORY_TO_PATH: Record<string, string> = {
    "Marketing": "/siglas-marketing",
    "Recursos Humanos": "/siglas-rh",
    "Financeiro": "/siglas-financeiras",
    "Tecnologia": "/siglas-tecnologia",
    "Vendas": "/siglas-vendas",
    "Logística": "/siglas-logistica",
    "Gestão": "/siglas-gestao",
    "Todas": "/"
  };

  // Sync selectedCategory with the URL path
  useEffect(() => {
    const matchedCategory = PATH_TO_CATEGORY[path];
    if (matchedCategory) {
      setSelectedCategory(matchedCategory);
    } else if (path === "/") {
      setSelectedCategory("Todas");
    }
  }, [path]);

  const handleSelectCategory = (cat: string) => {
    const targetPath = CATEGORY_TO_PATH[cat] || "/";
    navigate(targetPath);
  };

  useEffect(() => {
    function loadAllSiglas() {
      try {
        const data = getFilteredSiglas();
        setAllSiglas(data);
      } catch (err) {
        console.error("Erro ao pré-carregar siglas para PDF:", err);
      }
    }
    loadAllSiglas();
  }, []);

  // Sync theme changes with DOM document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Sync favorites changes with localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Static list of categories for footer linking
  const categoriesList = [
    "Gestão", "Marketing", "Tecnologia", "Vendas", "Financeiro", "Recursos Humanos", "Logística"
  ];

  // Routing Switch engine
  const renderView = () => {
    // 1. Home Directory & SEO Category Routes
    if (path === "/" || PATH_TO_CATEGORY[path]) {
      return (
        <HomeView
          navigate={navigate}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleSelectCategory}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
        />
      );
    }

    // 2. Sigla Detail Dynamic Route: match "/sigla/:slug", "/termo/:slug", "/cargo/:slug", etc.
    const pathPrefixes = ["/sigla/", "/termo/", "/cargo/", "/departamento/", "/metodologia/", "/ferramenta/", "/conceito/"];
    const matchedPrefix = pathPrefixes.find(p => path.startsWith(p));
    if (matchedPrefix) {
      const slug = path.replace(matchedPrefix, "").split(/[?#]/)[0];
      return (
        <SiglaDetailsView
          slug={slug}
          navigate={navigate}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      );
    }

    // 3. Blog List & Post Dynamic Route: match "/blog" or "/blog/:slug"
    if (path === "/blog") {
      return <BlogView navigate={navigate} />;
    }
    if (path.startsWith("/blog/")) {
      const slug = path.replace("/blog/", "").split(/[?#]/)[0];
      return <BlogView articleSlug={slug} navigate={navigate} />;
    }

    // 5. 404 Fallback
    return <Custom404View navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#FFFFFF] transition-colors duration-250">
      
      {/* Web Layout: Hidden when printing */}
      <div className="print:hidden flex flex-col min-h-screen">
        {/* Top sticky brand header bar */}
        <Header
          currentPath={path}
          navigate={navigate}
          setShowFavorites={setShowFavorites}
          showFavorites={showFavorites}
        />

        {/* Main Dynamic Viewport wrapper */}
        <main className="flex-grow">
          {renderView()}
        </main>

        {/* Shared bottom information map footer */}
        <Footer
          navigate={navigate}
          categories={categoriesList}
          onSelectCategory={(cat) => {
            handleSelectCategory(cat);
            setShowFavorites(false);
          }}
        />
      </div>

      {/* Dynamic PDF / Print Layout: Only visible when print is active (Save as PDF) */}
      <div className="hidden print:block text-black bg-white p-10 font-sans space-y-6">
        <div className="text-center border-b-2 border-teal-600 pb-5 mb-6">
          <h1 className="text-3xl font-extrabold text-teal-800 tracking-tight">Dicionário de Siglas Corporativas</h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Guia Completo para Aprender Siglas Corporativas em Português e Inglês
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Gerado gratuitamente por dicionariocorporativo.com.br</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <p className="font-bold text-teal-700">📌 Sobre este Dicionário:</p>
            <p className="text-slate-600 mt-0.5">Compilado completo da linguagem de siglas corporativas para impulsionar sua carreira, contendo conceitos fundamentais, definições objetivas e traduções em inglês.</p>
          </div>
          <div>
            <p className="font-bold text-teal-700">💡 Como Estudar:</p>
            <p className="text-slate-600 mt-0.5">Revise o glossário por categoria profissional e aplique os termos em reuniões, e-mails e apresentações de negócios.</p>
          </div>
        </div>

        {/* Categories section */}
        <div className="space-y-6">
          {categoriesList.map((cat) => {
            const catSiglas = allSiglas.filter(s => s.categoria.toLowerCase() === cat.toLowerCase());
            if (catSiglas.length === 0) return null;
            return (
              <div key={cat} className="break-inside-avoid page-break-inside-avoid py-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-teal-700 border-b border-slate-300 pb-1.5 mb-3 uppercase tracking-wider">
                  {cat}
                </h2>
                <div className="grid grid-cols-1 gap-3.5">
                  {catSiglas.map((s) => (
                    <div key={s.id} className="pb-3 border-b border-slate-100 last:border-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-base font-bold text-slate-900">{s.sigla}</span>
                        <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{s.subcategoria || "Geral"}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">{s.nome_completo}</p>
                      {s.traducao && s.traducao !== "Não aplicável" && (
                        <p className="text-[10px] text-slate-500 italic">Tradução: {s.traducao}</p>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{s.descricao_curta}</p>
                      {s.exemplo && (
                        <p className="text-[10px] text-slate-500 mt-1 italic bg-slate-50/55 p-1 rounded border-l-2 border-teal-500">
                          Exemplo de uso: "{s.exemplo}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6 border-t border-slate-200 text-[10px] text-slate-400">
          <p>© {new Date().getFullYear()} Dicionário Corporativo (dicionariocorporativo.com.br). Todos os direitos reservados.</p>
          <p>O maior dicionário online para aprender linguagem de siglas corporativas em português e inglês.</p>
        </div>
      </div>
    </div>
  );
}
