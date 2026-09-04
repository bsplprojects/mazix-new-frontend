import { useEffect, useRef } from "react";
import { Globe } from "lucide-react";

const GoogleTranslate = ({ className = "" }) => {
  const containerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !containerRef.current) return;

    const initTranslate = () => {
      if (window.google && window.google.translate && containerRef.current) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,ta,te,bn,mr,gu,kn,ml,pa,ur",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          containerRef.current
        );
        initialized.current = true;
      }
    };

    if (window.google && window.google.translate) {
      initTranslate();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.translate) {
          initTranslate();
          clearInterval(checkInterval);
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 10000);

      return () => clearInterval(checkInterval);
    }
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div ref={containerRef} className="translate-widget" />
    </div>
  );
};

export default GoogleTranslate;
