import React, { createContext, useContext, useState, useEffect } from "react";

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

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedUnlocked = localStorage.getItem("siglas_unlocked");
      const session = localStorage.getItem("auth_session");
      return savedUnlocked === "true" || !!session;
    }
    return false;
  });

  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("siglas_usage_count", usageCount.toString());
  }, [usageCount]);

  useEffect(() => {
    localStorage.setItem("siglas_unlocked", isUnlocked ? "true" : "false");
  }, [isUnlocked]);

  const checkAndIncrementUsage = (): boolean => {
    // If already unlocked (paid or VIP), always allow
    if (isUnlocked) {
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
    setIsUnlocked(true);
    setShowPaywall(false);
  };

  const resetUsage = () => {
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
