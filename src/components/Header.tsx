import React from "react";
import { BookOpen, Lock, Zap, ShieldCheck } from "lucide-react";
import { useUsageLimit } from "../context/UsageContext";

interface HeaderProps {
  currentPath: string;
  navigate: (to: string) => void;
  setShowFavorites: (show: boolean) => void;
  showFavorites: boolean;
}

export default function Header({
  currentPath,
  navigate,
  setShowFavorites,
  showFavorites,
}: HeaderProps) {
  const isHome = currentPath === "/";
  const isBlog = currentPath.startsWith("/blog");
  const isEbook = currentPath.startsWith("/ebook");
  const { usageCount, maxFreeUses, isUnlocked, setShowPaywall } = useUsageLimit();

  return (
    <header className="w-full bg-[#07111F] border-b border-white/[0.05] transition-all duration-250">
      <div className="max-w-[1280px] mx-auto px-5 min-[360px]:px-6 md:px-8 w-full h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => { navigate("/"); setShowFavorites(false); }}
          className="flex items-center space-x-3 cursor-pointer group select-none"
          id="brand-logo"
        >
          <div className="p-2 bg-[#111C31] border border-white/[0.08] rounded-xl text-[#00C2A8] shadow-sm group-hover:scale-105 transition-transform duration-250">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight uppercase">
              SIGLAS CORPORATIVAS
            </span>
            <span className="text-[10px] text-[#B6C2D0] font-medium uppercase tracking-wider">
              Dicionário Online
            </span>
          </div>
        </div>

        {/* Navigation Menu & Usage Status */}
        <nav className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Usage Limit Badge */}
          <button
            onClick={() => setShowPaywall(true)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 border ${
              isUnlocked
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : usageCount >= maxFreeUses
                ? "bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse"
                : "bg-[#111C31] text-[#00C2A8] border-[#00C2A8]/30 hover:border-[#00C2A8]"
            }`}
            title={isUnlocked ? "Acesso Vitalício Ativado" : "Clique para gerenciar seu acesso"}
          >
            {isUnlocked ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Acesso Vitalício</span>
              </>
            ) : usageCount >= maxFreeUses ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Bloqueado ({usageCount}/{maxFreeUses})</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-[#00C2A8]" />
                <span>{usageCount}/{maxFreeUses} Grátis</span>
              </>
            )}
          </button>

          <button
            onClick={() => { navigate("/"); setShowFavorites(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-250 ${
              isHome && !showFavorites
                ? "text-[#00C2A8] bg-[#111C31] border border-white/[0.08]"
                : "text-[#B6C2D0] hover:text-white hover:bg-[#111C31]"
            }`}
            id="nav-home"
          >
            Diretório
          </button>

          <button
            onClick={() => { navigate("/blog"); setShowFavorites(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-250 ${
              isBlog
                ? "text-[#00C2A8] bg-[#111C31] border border-white/[0.08]"
                : "text-[#B6C2D0] hover:text-white hover:bg-[#111C31]"
            }`}
            id="nav-blog"
          >
            Blog
          </button>

          <button
            onClick={() => { navigate("/ebook"); setShowFavorites(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-250 flex items-center space-x-1.5 ${
              isEbook
                ? "text-[#00C2A8] bg-[#111C31] border border-[#00C2A8]/40 shadow-sm"
                : "text-[#B6C2D0] hover:text-white hover:bg-[#111C31]"
            }`}
            id="nav-ebook"
          >
            <span>E-book A4</span>
            <span className="text-[9px] bg-[#00C2A8]/20 text-[#00C2A8] font-extrabold px-1.5 py-0.5 rounded uppercase">
              Novo
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}

