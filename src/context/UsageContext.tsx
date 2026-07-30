import React, { createContext, useContext, useState, useEffect } from "react";
import { getStoredSession } from "../lib/firebase";

interface UsageContextType {
  usageCount: number;
  maxFreeUses: number;
  isUnlocked: boolean;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  checkAndIncrementUsage: () => boolean;
  unlockAccess: () => void;
  resetUsage: () => void;
}

const MAX_FREE_USES = 3;

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usageCount, setUsageCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siglas_usage_count");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Calculate unlock status: Lifetime access is granted ONLY if user is logged in with username/password OR entered verified VIP code
  const checkCurrentUnlocked = (): boolean => {
    if (typeof window === "undefined") return false;
    const session = getStoredSession();
    const vipUnlocked = localStorage.getItem("siglas_vip_unlocked") === "true";
    return !!session || vipUnlocked;
  };

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => checkCurrentUnlocked());
  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  // Synchronize state with session changes or window focus
  useEffect(() => {
    const syncStatus = () => {
      setIsUnlocked(checkCurrentUnlocked());
    };

    syncStatus();
    window.addEventListener("storage", syncStatus);
    window.addEventListener("focus", syncStatus);
    return () => {
      window.removeEventListener("storage", syncStatus);
      window.removeEventListener("focus", syncStatus);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("siglas_usage_count", usageCount.toString());
    }
  }, [usageCount]);

  const checkAndIncrementUsage = (): boolean => {
    // Re-check current unlock state dynamically
    const currentlyUnlocked = checkCurrentUnlocked();
    if (currentlyUnlocked) {
      if (!isUnlocked) setIsUnlocked(true);
      return true;
    }

    // Check if limit is reached
    if (usageCount >= MAX_FREE_USES) {
      setShowPaywall(true);
      return false;
    }

    // Increment usage count and allow
    const nextCount = usageCount + 1;
    setUsageCount(nextCount);
    return true;
  };

  const unlockAccess = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("siglas_vip_unlocked", "true");
    }
    setIsUnlocked(true);
    setShowPaywall(false);
  };

  const resetUsage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("siglas_vip_unlocked");
      localStorage.removeItem("siglas_unlocked");
      localStorage.removeItem("siglas_usage_count");
    }
    setUsageCount(0);
    setIsUnlocked(false);
    setShowPaywall(false);
  };

  return (
    <UsageContext.Provider
      value={{
        usageCount,
        maxFreeUses: MAX_FREE_USES,
        isUnlocked,
        showPaywall,
        setShowPaywall,
        checkAndIncrementUsage,
        unlockAccess,
        resetUsage
      }}
    >
      {children}
    </UsageContext.Provider>
  );
};

export const useUsageLimit = () => {
  const context = useContext(UsageContext);
  if (!context) {
    throw new Error("useUsageLimit deve ser usado dentro de um UsageProvider");
  }
  return context;
};

