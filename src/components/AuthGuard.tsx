import React, { useState, useEffect } from "react";
import { BookOpen, Lock, LogOut, AlertCircle, Loader2 } from "lucide-react";
import SalesPage from "./SalesPage";
import { 
  auth, 
  loginWithFirebase, 
  logoutFirebase, 
  onAuthStateChanged, 
  getStoredSession,
  AuthSession,
  User 
} from "../lib/firebase";

interface AuthGuardProps {
  children: React.ReactNode;
  onUserLogout?: () => void;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [localSession, setLocalSession] = useState<AuthSession | null>(getStoredSession());
  const [loading, setLoading] = useState(true);
  const [showLoginPage, setShowLoginPage] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname === "/login" || window.location.search.includes("login");
    }
    return false;
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === "/login" || window.location.search.includes("login")) {
        setShowLoginPage(true);
      } else {
        setShowLoginPage(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openLogin = () => {
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.history.pushState(null, "", "/login");
    }
    setShowLoginPage(true);
  };

  const closeLogin = () => {
    if (typeof window !== "undefined" && window.location.pathname === "/login") {
      window.history.pushState(null, "", "/");
    }
    setShowLoginPage(false);
  };

  // Form states - empty by default so credentials remain secret
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setLoading(false);
    });

    const activeSession = getStoredSession();
    if (activeSession) {
      setLocalSession(activeSession);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!firebaseUser || !!localSession;
  const activeUserLabel = firebaseUser?.email?.split("@")[0] || localSession?.username || "siglascorporativas";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Por favor, preencha o usuário e a senha.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithFirebase(username.trim(), password.trim());
      setLocalSession({
        username: res.username,
        email: res.email,
        loggedInAt: Date.now()
      });
    } catch (err: any) {
      console.error("Erro no login:", err);
      setErrorMsg(err.message || "Usuário ou senha incorretos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setLocalSession(null);
    try {
      await logoutFirebase();
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111F] text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#00C2A8] animate-spin" />
        <p className="text-sm font-medium text-[#B6C2D0]">Verificando acesso ao Dicionário...</p>
      </div>
    );
  }

  // If NOT authenticated, show Sales Page by default, or Login Screen if requested
  if (!isAuthenticated) {
    if (!showLoginPage) {
      return <SalesPage onBackToLogin={openLogin} />;
    }

    return (
      <div className="min-h-screen bg-[#07111F] text-white flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#0B1727] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 bg-[#111C31] border border-[#00C2A8]/30 rounded-2xl text-[#00C2A8] shadow-lg">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
              Dicionário Corporativo
            </h1>
            <p className="text-xs text-[#B6C2D0] leading-relaxed">
              Área restrita de alunos. Informe suas credenciais de acesso para entrar.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#B6C2D0] uppercase tracking-wider">
                Usuário / E-mail
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu usuário de acesso"
                className="w-full px-4 py-2.5 bg-[#111C31] border border-white/10 rounded-xl text-sm text-white placeholder-[#7C8AA5] focus:outline-none focus:border-[#00C2A8] transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#B6C2D0] uppercase tracking-wider">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#111C31] border border-white/10 rounded-xl text-sm text-white placeholder-[#7C8AA5] focus:outline-none focus:border-[#00C2A8] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#00C2A8] hover:bg-[#00e6c7] text-[#07111F] font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Entrar no Dicionário</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center space-y-2">
            <button
              type="button"
              onClick={closeLogin}
              className="text-xs text-[#00C2A8] font-bold underline hover:text-[#00e6c7] transition-colors"
            >
              ← Voltar para a página inicial de vendas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render children with a top banner or logout handle
  return (
    <div className="relative">
      {/* Top bar indicator for authenticated user */}
      <div className="bg-[#111C31] border-b border-white/5 px-4 py-1.5 text-xs text-[#B6C2D0] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#00C2A8] animate-pulse"></span>
          <span>Sessão ativa: <strong className="text-white font-mono">{activeUserLabel}</strong></span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-[#7C8AA5] hover:text-red-400 font-semibold transition-colors text-[11px]"
          title="Sair do Dicionário"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair</span>
        </button>
      </div>

      {children}
    </div>
  );
}
