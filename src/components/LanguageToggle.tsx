import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-1">
      <Globe className="w-4 h-4 text-muted-foreground ml-2" />
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
          language === "en"
            ? "bg-election-blue text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
          language === "hi"
            ? "bg-election-gold text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        हिंदी
      </button>
    </div>
  );
}
