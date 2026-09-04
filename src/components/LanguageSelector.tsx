import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
];

const LanguageSelector = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [isTranslateReady, setIsTranslateReady] = useState(false);
  const dropdownRef = useRef(null);
  const initAttempts = useRef(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src*="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]',
    );

    const initTranslate = () => {
      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,ta,te,bn,mr,gu,kn,ml,pa,ur",
              autoDisplay: false,
            },
            "google_translate_hidden",
          );
          setIsTranslateReady(true);
        } catch (e) {
          console.log("Translate init error:", e);
        }
      }
    };

    if (!existingScript) {
      window.googleTranslateElementInit = initTranslate;

      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Script exists, wait for it to be ready
      const checkReady = setInterval(() => {
        initAttempts.current += 1;
        if (window.google && window.google.translate) {
          initTranslate();
          clearInterval(checkReady);
        }
        if (initAttempts.current > 50) {
          clearInterval(checkReady);
        }
      }, 100);

      return () => clearInterval(checkReady);
    }
  }, []);

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    setIsOpen(false);

    // Try multiple methods to trigger translation
    const tryTranslate = () => {
      // Method 1: Use the combo selector
      const selectElement = document.querySelector(".goog-te-combo");
      if (selectElement) {
        selectElement.value = lang.code;
        selectElement.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }

      // Method 2: Use iframe method
      const frame = document.querySelector(".goog-te-menu-frame");
      if (frame) {
        const frameDoc = frame.contentDocument || frame.contentWindow.document;
        const items = frameDoc.querySelectorAll(".goog-te-menu2-item");
        items.forEach((item) => {
          if (
            item.textContent.toLowerCase().includes(lang.name.toLowerCase())
          ) {
            item.click();
          }
        });
        return true;
      }

      return false;
    };

    // Retry a few times if not immediately available
    let attempts = 0;
    const interval = setInterval(() => {
      if (tryTranslate() || attempts >= 10) {
        clearInterval(interval);
      }
      attempts++;
    }, 200);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Hidden Google Translate element */}
      <div id="google_translate_hidden" className="!hidden" />

      {/* Custom dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-lg">{selectedLang.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">
          {selectedLang.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-elevated z-50 overflow-hidden animate-fade-up">
          <div className="py-2 max-h-64 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors ${
                  selectedLang.code === lang.code ? "bg-primary/10" : ""
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-medium flex-1">{lang.name}</span>
                {selectedLang.code === lang.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
