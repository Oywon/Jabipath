import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Aurora } from "@/components/Aurora";
import { AppLogo } from "@/components/AppLogo";
import { useT, useLang } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MapPin, Route as RouteIcon, Volume2, ArrowRight, Sparkles } from "lucide-react";

export default function Landing() {
  const t = useT();
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const featuresRef = useRef(null);

  useEffect(() => {
    if (reduced || !featuresRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-feature]", {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
      });
    }, featuresRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="relative min-h-dvh text-foreground overflow-hidden">
      <Aurora position="fixed" intensity={0.95} />

      <div className="relative z-10">
        <header className="sticky top-0 z-30 glass border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <AppLogo showText markClassName="size-10" />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Link
                to="/map"
                className="min-h-11 px-5 py-2 rounded-full bg-brand-gradient text-white text-sm font-semibold shadow-glow hover:scale-[1.03] transition-transform inline-flex items-center"
              >
                {t("map")}
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 pt-16 pb-24 sm:pt-24">
          <section className="text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.18em] text-foreground/90"
            >
              <Sparkles className="size-3.5 text-violet" aria-hidden />
              Jahangirnagar University
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`mt-8 text-5xl sm:text-7xl font-bold tracking-tight text-balance leading-[1.05] ${
                lang === "bn" ? "font-bengali" : ""
              }`}
            >
              {lang === "bn" ? (
                <>
                  ক্যাম্পাসে চলুন
                  <br />
                  <span className="text-gradient">নিরাপদে, স্বাধীনভাবে।</span>
                </>
              ) : (
                <>
                  Move across campus,
                  <br />
                  <span className="text-gradient">safely and freely.</span>
                </>
              )}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className={`mt-6 text-lg sm:text-xl text-muted-foreground text-balance ${
                lang === "bn" ? "font-bengali" : ""
              }`}
            >
              {t("tagline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex justify-center gap-3"
            >
              <Link
                to="/map"
                className="group relative inline-flex items-center gap-2 min-h-12 px-7 py-3 rounded-full bg-brand-gradient text-white font-semibold shadow-glow hover:scale-[1.04] transition-transform"
              >
                <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
                {t("getStarted")}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </section>

          <section
            ref={featuresRef}
            className="mt-28 grid sm:grid-cols-3 gap-5"
            aria-label={t("features")}
          >
            {[
              { icon: MapPin, k: "featureMap", d: "featureMapDesc" },
              { icon: RouteIcon, k: "featureRoute", d: "featureRouteDesc" },
              { icon: Volume2, k: "featureVoice", d: "featureVoiceDesc" },
            ].map(({ icon: Icon, k, d }) => (
              <div
                key={k}
                data-feature
                className="group relative rounded-3xl glass p-6 overflow-hidden hover:ring-glow transition-shadow"
              >
                <div
                  className="absolute -top-12 -right-12 size-40 rounded-full opacity-50 group-hover:opacity-80 transition-opacity"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.55 0.28 285 / 0.55), transparent 65%)",
                    filter: "blur(20px)",
                  }}
                />
                <div className="relative">
                  <div className="size-12 rounded-xl bg-brand-gradient grid place-items-center text-white shadow-glow">
                    <Icon className="size-5" />
                  </div>
                  <h3
                    className={`mt-5 text-xl font-semibold tracking-tight ${
                      lang === "bn" ? "font-bengali" : ""
                    }`}
                  >
                    {t(k)}
                  </h3>
                  <p
                    className={`mt-2 text-sm text-muted-foreground leading-relaxed ${
                      lang === "bn" ? "font-bengali" : ""
                    }`}
                  >
                    {t(d)}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </main>

        <footer className="border-t border-white/5 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-muted-foreground flex justify-between font-mono uppercase tracking-wider">
            <span>© {new Date().getFullYear()} জাবি পথ · JU Path</span>
            <span>WCAG 2.1 AA</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
