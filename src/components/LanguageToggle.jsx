import { useLang } from "@/lib/i18n";

export function LanguageToggle({ className = "" }) {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "bn" ? "en" : "bn")}
      className={`min-h-11 px-3 py-1.5 rounded-full ring-1 ring-white/10 glass text-sm font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-1.5 ${className}`}
      aria-label="Toggle language"
    >
      <span className={lang === "bn" ? "font-bold text-gradient" : "text-muted-foreground"}>বাংলা</span>
      <span className="text-muted-foreground/40">/</span>
      <span className={lang === "en" ? "font-bold text-gradient font-mono" : "text-muted-foreground font-mono"}>EN</span>
    </button>
  );
}
