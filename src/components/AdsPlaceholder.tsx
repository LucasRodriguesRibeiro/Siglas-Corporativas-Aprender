import React, { useEffect, useState } from "react";

interface AdsPlaceholderProps {
  position: "top" | "sidebar" | "content" | "footer";
}

export default function AdsPlaceholder({ position }: AdsPlaceholderProps) {
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      // Identify custom production domains by excluding local development, AI Studio staging/preview, and default cloud run URLs
      const isProd = !hostname.includes("localhost") && 
                     !hostname.includes("127.0.0.1") && 
                     !hostname.includes("ais-dev") && 
                     !hostname.includes("ais-pre") &&
                     !hostname.includes("run.app");
      
      setIsProduction(isProd);

      if (isProd) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          // Catch any push errors before script loads
        }
      }
    }
  }, [position]);

  if (!isProduction) {
    return null; // Do not render any empty ad container or whitespace on dev/preview environments to avoid blank spaces
  }

  const styles = {
    top: "w-full max-w-4xl mx-auto overflow-hidden",
    sidebar: "w-full sticky top-24 hidden lg:block overflow-hidden",
    content: "w-full overflow-hidden",
    footer: "w-full max-w-4xl mx-auto overflow-hidden",
  };

  return (
    <div className={styles[position]} id={`ad-space-${position}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7149100665310787"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}


