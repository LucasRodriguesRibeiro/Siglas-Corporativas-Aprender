import React from "react";
import { BookOpen } from "lucide-react";

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

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07111F]/80 backdrop-blur-[14px] border-b border-white/[0.05] transition-all duration-250">
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

        {/* Navigation Menu */}
        <nav className="flex items-center space-x-1.5 sm:space-x-3">
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
        </nav>
      </div>
    </header>
  );
}
