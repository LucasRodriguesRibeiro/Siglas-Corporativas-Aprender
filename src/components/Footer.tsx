import React from "react";
import { BookOpen, ShieldAlert, Heart } from "lucide-react";

interface FooterProps {
  navigate: (to: string) => void;
  categories: string[];
  onSelectCategory: (category: string) => void;
}

export default function Footer({ navigate, categories, onSelectCategory }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D1628] border-t border-white/[0.08] mt-auto transition-all duration-250">
      <div className="max-w-[1280px] mx-auto px-5 min-[360px]:px-6 md:px-8 w-full py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand details */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="p-1.5 bg-[#111C31] border border-white/[0.08] rounded-lg text-[#00C2A8]">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-lg text-white uppercase tracking-tight">
                SIGLAS CORPORATIVAS
              </span>
            </div>
            <p className="text-sm text-[#B6C2D0] max-w-sm leading-relaxed">
              O maior dicionário online de siglas corporativas do Brasil. Domine termos em português e inglês com tradução, pronúncia e baixe em PDF grátis.
            </p>
            <div className="flex space-x-3 text-xs text-[#7C8AA5]">
              <span className="flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Em conformidade com a LGPD</span>
              </span>
            </div>
          </div>

          {/* Col 2: Categories quick-links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8AA5] mb-4">
              Categorias Principais
            </h3>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                    }}
                    className="text-sm text-[#B6C2D0] hover:text-[#00C2A8] transition-colors text-left"
                  >
                    Siglas de {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Portal Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C8AA5] mb-4">
              Recursos
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-sm text-[#B6C2D0] hover:text-[#00C2A8] transition-colors text-left"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/blog")}
                  className="text-sm text-[#B6C2D0] hover:text-[#00C2A8] transition-colors text-left"
                >
                  Artigos e Blog
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7C8AA5]">
          <p>
            &copy; {currentYear} Dicionário Corporativo. Desenvolvido para o ambiente corporativo brasileiro de alta performance.
          </p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Feito com</span>
            <Heart className="w-3 h-3 text-[#EF4444] fill-current" />
            <span>para escalar seu vocabulário.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
