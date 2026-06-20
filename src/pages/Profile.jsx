import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useT, useLang } from "@/lib/i18n";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { loadPublicProfile, savePublicProfile } from "@/lib/public-profile";

export default function Profile() {
  const t = useT();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [disability, setDisability] = useState("none");
  const [voice, setVoice] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const profile = loadPublicProfile();
    setFullName(profile.fullName ?? "");
    setDisability(profile.disability ?? "none");
    setVoice(!!profile.voiceEnabled);
  }, []);

  async function save() {
    setSaving(true);
    try {
      savePublicProfile({
        fullName: fullName.trim(),
        disability,
        voiceEnabled: voice,
        onboarded: true,
      });
      toast.success(lang === "bn" ? "সংরক্ষিত হয়েছে" : "Saved");
      navigate("/map");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="px-4 py-3 flex items-center justify-between border-b border-border">
        <Link to="/map" className="flex items-center gap-2 text-sm font-medium hover:underline">
          <ChevronLeft className="size-4" /> {t("back")}
        </Link>
        <LanguageToggle />
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className={`text-2xl font-semibold tracking-tight ${lang === "bn" ? "font-bengali" : ""}`}>
          {t("profile")}
        </h1>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="fn" className="block text-sm font-medium mb-1.5">
              {t("fullName")}
            </label>
            <input
              id="fn"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full min-h-11 px-4 py-2.5 rounded-lg ring-1 ring-border bg-card focus:ring-2 focus:ring-brand outline-none"
            />
          </div>
          <div>
            <label htmlFor="dis" className={`block text-sm font-medium mb-1.5 ${lang === "bn" ? "font-bengali" : ""}`}>
              {t("disability")}
            </label>
            <select
              id="dis"
              value={disability}
              onChange={(e) => setDisability(e.target.value)}
              className="w-full min-h-11 px-4 py-2.5 rounded-lg ring-1 ring-border bg-card focus:ring-2 focus:ring-brand outline-none"
            >
              <option value="none">{t("d_none")}</option>
              <option value="wheelchair">{t("d_wheelchair")}</option>
              <option value="visual">{t("d_visual")}</option>
              <option value="hearing">{t("d_hearing")}</option>
              <option value="cognitive">{t("d_cognitive")}</option>
            </select>
          </div>
          <label className="flex items-center justify-between p-4 rounded-xl bg-card ring-1 ring-border cursor-pointer">
            <span className={lang === "bn" ? "font-bengali font-medium" : "font-medium"}>
              {t("voiceGuide")}
              <span className="ml-2 text-xs text-muted-foreground">({t("comingSoon")})</span>
            </span>
            <input
              type="checkbox"
              checked={voice}
              onChange={(e) => setVoice(e.target.checked)}
              className="size-5 accent-[color:var(--brand)]"
            />
          </label>
          <button
            onClick={save}
            disabled={saving}
            className="w-full min-h-12 rounded-lg bg-brand text-brand-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {t("save")}
          </button>
        </div>
      </main>
    </div>
  );
}
