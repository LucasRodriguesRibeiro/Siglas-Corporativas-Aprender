import React, { useState } from "react";
import {
  Lock,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  X,
  CreditCard,
  Key,
  BookOpen,
  HelpCircle,
  Clock
} from "lucide-react";
import { useUsageLimit } from "../context/UsageContext";

const HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/R106890432S?bid=1785171780452";

export default function PaywallModal() {
  const { showPaywall, setShowPaywall, usageCount, maxFreeUses, unlockAccess } = useUsageLimit();
  const [vipCode, setVipCode] = useState("");
  const [vipError, setVipError] = useState(false);
  const [vipSuccess, setVipSuccess] = useState(false);
  const [showVipInput, setShowVipInput] = useState(false);

  if (!showPaywall) return null;

  const handleActivateVip = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = vipCode.trim().toUpperCase();
    
    // Strict verification code (e.g. valid purchase code or explicit license)
    if (["SIGLAS5", "PAGO-5REAIS-OK", "HOTMART-VIP-2026"].includes(cleanCode)) {
      setVipSuccess(true);
      setVipError(false);
      setTimeout(() => {
        unlockAccess();
      }, 800);
    } else {
      setVipError(true);
      setVipSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/90 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#0B1727] border-2 border-[#00C2A8]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C2A8]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => setShowPaywall(false)}
          className="absolute top-4 right-4 p-2 text-[#7C8AA5] hover:text-white bg-[#111C31] hover:bg-white/10 rounded-full transition-colors z-10"
          title="Fechar por enquanto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-500/15 border border-amber-500/40 rounded-full text-xs font-bold text-amber-400">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Limite de Consultas Gratuitas Atingido ({usageCount}/{maxFreeUses})</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Desbloqueie o Acesso <span className="bg-gradient-to-r from-[#00C2A8] via-[#00E5FF] to-[#38BDF8] bg-clip-text text-transparent">Ilimitado</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#B6C2D0] leading-relaxed max-w-md mx-auto">
            Você já realizou suas <strong>3 consultas gratuitas</strong>. Para pesquisar e acessar todas as <strong>+500 siglas corporativas</strong> sem limitações, libere seu acesso vitalício.
          </p>
        </div>

        {/* Benefits Box */}
        <div className="bg-[#111C31] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 relative z-10">
          <h3 className="text-xs font-extrabold uppercase text-[#00C2A8] tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4" />
            <span>O que está incluído no Acesso Vitalício:</span>
          </h3>

          <ul className="space-y-2 text-xs text-white">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8] shrink-0 mt-0.5" />
              <span><strong>Busca Ilimitada:</strong> Pesquise qualquer sigla, termo ou cargo a qualquer momento.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8] shrink-0 mt-0.5" />
              <span><strong>Exemplos Reais de Reuniões:</strong> Frases prontas de como usar cada sigla com diretores.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8] shrink-0 mt-0.5" />
              <span><strong>E-book A4 Completo em PDF:</strong> Baixe o guia completo formatado para impressão.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8] shrink-0 mt-0.5" />
              <span><strong>Novos Termos Diários:</strong> Atualizações contínuas sem custos adicionais.</span>
            </li>
          </ul>
        </div>

        {/* Price Card */}
        <div className="bg-gradient-to-br from-[#111C31] to-[#07111F] border border-[#00C2A8]/40 rounded-2xl p-5 text-center space-y-2 relative z-10 shadow-xl">
          <span className="text-[11px] text-[#7C8AA5] uppercase tracking-wider font-bold block">
            Oferta Especial por Tempo Limitado
          </span>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs text-[#7C8AA5] line-through">De R$ 97,00</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full">
              95% OFF
            </span>
          </div>

          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-sm font-bold text-[#00C2A8]">R$</span>
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">5,00</span>
          </div>

          <p className="text-[11px] text-[#00C2A8] font-bold">
            Pagamento Único • Sem Mensalidades • Acesso Vitalício Impossível de Perder
          </p>
        </div>

        {/* Primary Checkout CTA Button */}
        <div className="space-y-3 relative z-10">
          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-[#00C2A8] hover:bg-[#00e6c7] text-[#07111F] font-black text-sm sm:text-base rounded-2xl transition-all shadow-xl shadow-[#00C2A8]/20 flex items-center justify-center space-x-2 active:scale-95 text-center uppercase tracking-wide"
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>DESBLOQUEAR POR R$ 5,00 AGORA</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </a>

          {/* Guarantee / Security badges */}
          <div className="flex items-center justify-center space-x-4 text-[10px] text-[#7C8AA5]">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>7 Dias de Garantia</span>
            </span>
            <span className="flex items-center space-x-1">
              <CreditCard className="w-3.5 h-3.5 text-[#00C2A8]" />
              <span>Pix ou Cartão</span>
            </span>
          </div>
        </div>

        {/* VIP / Code activation toggle */}
        <div className="pt-3 border-t border-white/10 text-center space-y-2 relative z-10">
          {!showVipInput ? (
            <button
              onClick={() => setShowVipInput(true)}
              className="text-xs text-[#7C8AA5] hover:text-[#00C2A8] transition-colors underline"
            >
              Já efetuou o pagamento? Digite seu código VIP ou e-mail
            </button>
          ) : (
            <form onSubmit={handleActivateVip} className="space-y-2 text-left">
              <label className="text-[11px] text-[#B6C2D0] font-medium block">
                Insira seu Código VIP ou E-mail da compra:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={vipCode}
                  onChange={(e) => {
                    setVipCode(e.target.value);
                    setVipError(false);
                  }}
                  placeholder="Ex: VIP5 ou seu@email.com"
                  className="flex-1 px-3 py-2 bg-[#111C31] border border-white/20 rounded-xl text-xs text-white placeholder-[#7C8AA5] focus:outline-none focus:border-[#00C2A8]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00C2A8] hover:bg-[#00e6c7] text-[#07111F] font-bold text-xs rounded-xl transition-all shrink-0"
                >
                  Ativar
                </button>
              </div>

              {vipSuccess && (
                <p className="text-xs text-emerald-400 font-bold">
                  ✓ Acesso vitalício ativado com sucesso! Carregando...
                </p>
              )}
              {vipError && (
                <p className="text-xs text-rose-400">
                  Código ou e-mail de compra não localizado.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
