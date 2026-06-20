import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useT, useLang } from "@/lib/i18n";
import { toast } from "sonner";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Aurora } from "@/components/Aurora";
import { AppLogo } from "@/components/AppLogo";
import { Accessibility, Ear, Eye, Brain, CircleSlash } from "lucide-react";
import { loadPublicProfile, savePublicProfile } from "@/lib/public-profile";

const OPTIONS = [
  { value: "wheelchair", key: "d_wheelchair", icon: Accessibility },
  { value: "visual", key: "d_visual", icon: Eye },
  { value: "hearing", key: "d_hearing", icon: Ear },
  { value: "cognitive", key: "d_cognitive", icon: Brain },
  { value: "none", key: "d_none", icon: CircleSlash },
];

export default function Onboarding() {
  const t = useT();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("none");
  const [voice, setVoice] = useState(false);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const profile = loadPublicProfile();
    if (profile.onboarded) {
      navigate("/map");
      return;
    }
    setSelected(profile.disability ?? "none");
    setVoice(!!profile.voiceEnabled);
    setFullName(profile.fullName ?? "");
  }, [navigate]);

  async function save() {
    setSaving(true);
    try {
      savePublicProfile({
        fullName: fullName.trim(),
        disability: selected,
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
    <div className="relative min-h-dvh overflow-hidden">
      <Aurora position="fixed" intensity={0.7} />
      <div className="relative z-10">
        <header className="px-4 py-3 flex items-center justify-between border-b border-white/5 glass">
          <div className="flex items-center gap-2">
            <AppLogo showText markClassName="size-9" />
          </div>
          <LanguageToggle />
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight text-gradient ${lang === "bn" ? "font-bengali" : ""}`}>
              {t("onboardingTitle")}
            </h1>
            <p className={`text-base text-muted-foreground mt-2 ${lang === "bn" ? "font-bengali" : ""}`}>
              {t("onboardingSub")}
            </p>
          </motion.div>

          <div className="mt-10 space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                {t("fullName")}
              </label>
              <input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full min-h-12 px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-brand outline-none transition"
              />
            </div>

            <fieldset>
              <legend className={`text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
                {t("disability")}
              </legend>
              <div className="grid sm:grid-cols-2 gap-3">
                {OPTIONS.map((opt, i) => {
                  const Icon = opt.icon;
                  const checked = selected === opt.value;
                  return (
                    <motion.label
                      key={opt.value}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.05 * i }}
                      whileHover={{ y: -2 }}
                      className={`relative flex items-center gap-3 p-4 rounded-2xl cursor-pointer ring-1 transition overflow-hidden ${
                        checked
                          ? "ring-brand bg-brand/15 ring-glow"
                          : "bg-white/5 ring-white/10 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="disability"
                        value={opt.value}
                        checked={checked}
                        onChange={() => setSelected(opt.value)}
                        className="sr-only"
                      />
                      <div
                        className={`size-11 grid place-items-center rounded-xl ${
                          checked ? "bg-brand-gradient text-white shadow-glow" : "bg-white/10 text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <span className={`font-semibold ${lang === "bn" ? "font-bengali" : ""}`}>
                        {t(opt.key)}
                      </span>
                    </motion.label>
                  );
                })}
              </div>
            </fieldset>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 cursor-pointer">
              <span className={lang === "bn" ? "font-bengali font-medium" : "font-medium"}>
                {t("voiceGuide")}
                <span className="ml-2 text-xs text-muted-foreground">({t("comingSoon")})</span>
              </span>
              <input
                type="checkbox"
                checked={voice}
                onChange={(e) => setVoice(e.target.checked)}
                className="size-5 accent-brand"
              />
            </label>

            <button
              onClick={save}
              disabled={saving}
              className="w-full min-h-12 rounded-xl bg-brand-gradient text-white font-semibold shadow-glow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition"
            >
              {t("save")}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
