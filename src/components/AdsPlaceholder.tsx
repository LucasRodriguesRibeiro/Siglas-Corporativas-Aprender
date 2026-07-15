import React from "react";
import { Sparkles } from "lucide-react";

interface AdsPlaceholderProps {
  position: "top" | "sidebar" | "content" | "footer";
}

export default function AdsPlaceholder({ position }: AdsPlaceholderProps) {
  const styles = {
    top: "w-full max-w-4xl mx-auto h-24 mb-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center p-4",
    sidebar: "w-full h-96 sticky top-24 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 hidden lg:flex",
    content: "w-full h-32 my-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center p-4",
    footer: "w-full max-w-4xl mx-auto h-24 mt-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center p-4",
  };

  const labels = {
    top: "Publicidade Recomendada (728x90)",
    sidebar: "Publicidade Lateral (300x600)",
    content: "Anúncio Patrocinado (Conteúdo)",
    footer: "Publicidade Rodapé (728x90)",
  };

  return (
    <div className={styles[position]} id={`ad-space-${position}`}>
      <div className="flex flex-col items-center text-center space-y-1">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{labels[position]}</span>
        </div>
        <p className="text-[11px] text-slate-350 dark:text-slate-600">
          Espaço reservado para o Google AdSense (sem prejudicar a experiência do usuário)
        </p>
      </div>
    </div>
  );
}
