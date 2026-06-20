import { useEffect, useRef, useState } from "react";
import { useT, useLang, bilingual, t as tt } from "@/lib/i18n";
import { ArrowRight, MapPin, Accessibility, Volume2, Square } from "lucide-react";
import { speakSequence, cancelSpeech, isTTSAvailable } from "@/lib/tts";

function stepsFromPath(path, edges) {
  return path.map((n, i) => ({
    toNode: n,
    edge: i === 0 ? null : edges[i - 1] ?? null,
  }));
}

export function DirectionsPanel({ path, edges, distance, fare }) {
  const t = useT();
  const { lang } = useLang();
  const [speaking, setSpeaking] = useState(false);
  const cancelRef = useRef(null);

  useEffect(() => {
    return () => {
      cancelRef.current?.();
      cancelSpeech();
    };
  }, []);

  useEffect(() => {
    cancelRef.current?.();
    setSpeaking(false);
  }, [path]);

  if (!path || path.length < 2) {
    return (
      <div className="px-6 py-8 text-center text-muted-foreground">
        <MapPin className="size-8 mx-auto mb-3 opacity-40" aria-hidden />
        <p className="font-medium">{t("pickTwo")}</p>
      </div>
    );
  }

  const steps = stepsFromPath(path, edges);
  const minutes = Math.max(1, Math.round(distance / 80));

  function buildSpokenSteps() {
    if (!path || path.length < 2) return [];
    const lines = [];
    lines.push(`${tt("start", lang)}: ${bilingual(path[0].name_bn, path[0].name_en, lang)}.`);
    for (let i = 1; i < path.length; i++) {
      const node = path[i];
      const edge = edges[i - 1];
      const name = bilingual(node.name_bn, node.name_en, lang);
      const d = edge ? Math.round(edge.distance) : 0;
      const isLast = i === path.length - 1;
      let line = isLast
        ? `${tt("arrive", lang)} ${name}.`
        : `${tt("headTo", lang)} ${name} — ${d} ${tt("meters", lang)}.`;
      if (edge?.has_ramp) line += ` ${tt("useRamp", lang)}.`;
      if (edge?.has_elevator) line += ` ${tt("useElevator", lang)}.`;
      lines.push(line);
    }
    return lines;
  }

  function playSteps() {
    if (!isTTSAvailable()) return;
    setSpeaking(true);
    cancelRef.current = speakSequence(buildSpokenSteps(), lang, {
      gapMs: 250,
      onDone: () => setSpeaking(false),
    });
  }

  function stopSteps() {
    cancelRef.current?.();
    setSpeaking(false);
  }

  return (
    <div className="px-5 sm:px-6 pb-8 pt-2">
      <header className="flex justify-between items-start gap-3 mb-5">
        <div className="min-w-0">
          <h2 className={`text-lg font-semibold leading-tight ${lang === "bn" ? "font-bengali" : ""}`}>
            {bilingual(path[path.length - 1].name_bn, path[path.length - 1].name_en, lang)}{" "}
            <span className="text-sm font-normal text-muted-foreground block">
              {t("directions")}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {Math.round(distance)} {t("meters")} • {minutes} {t("minWalk")} • {t("fare")} ৳{fare ?? 0}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="rounded-2xl bg-brand-gradient text-white px-3 py-2 shadow-glow min-w-28 text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-85 font-semibold">
              {t("fare")}
            </div>
            <div className="text-2xl font-bengali font-bold leading-none mt-1">
              ৳{fare ?? 0}
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold ring-1 ring-brand/20">
            <Accessibility className="size-3.5" aria-hidden />
            {lang === "bn" ? "অ্যাক্সেসযোগ্য" : "Accessible"}
          </span>
          {isTTSAvailable() ? (
            speaking ? (
              <button
                type="button"
                onClick={stopSteps}
                className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-full bg-destructive/15 text-destructive ring-1 ring-destructive/30 text-xs font-semibold hover:bg-destructive/20"
              >
                <Square className="size-3.5" aria-hidden />
                {t("stopDirections")}
              </button>
            ) : (
              <button
                type="button"
                onClick={playSteps}
                className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-full bg-brand-gradient text-white text-xs font-semibold shadow-glow hover:scale-[1.03] transition-transform"
              >
                <Volume2 className="size-3.5" aria-hidden />
                {t("playDirections")}
              </button>
            )
          ) : (
            <span className="text-[10px] text-muted-foreground">{t("voiceUnsupported")}</span>
          )}
        </div>
      </header>

      <ol className="space-y-4" aria-label={t("directions")}>
        {steps.map((s, i) => {
          const isFirst = i === 0;
          const isLast = i === steps.length - 1;
          const accent = s.edge?.has_ramp || s.edge?.has_elevator;
          return (
            <li key={s.toNode.id} className="flex gap-4">
              <div className="shrink-0 flex flex-col items-center">
                <div
                  className={`size-9 rounded-full ring-1 ring-border flex items-center justify-center text-sm font-semibold ${
                    isLast
                      ? "bg-accent text-accent-foreground"
                      : accent
                        ? "bg-warn/20 text-foreground"
                        : "bg-muted text-foreground"
                  }`}
                  aria-hidden
                >
                  {isLast ? <MapPin className="size-4" /> : i + 1}
                </div>
                {!isLast && <div className="w-0.5 h-full bg-border mt-2 min-h-6" />}
              </div>
              <div className={`pb-4 ${isLast ? "" : "border-b border-border/60"} w-full`}>
                <p className={`text-base font-medium leading-tight ${lang === "bn" ? "font-bengali" : ""}`}>
                  {isFirst
                    ? `${t("start")}: ${bilingual(s.toNode.name_bn, s.toNode.name_en, lang)}`
                    : isLast
                      ? `${t("arrive")} ${bilingual(s.toNode.name_bn, s.toNode.name_en, lang)}`
                      : `${t("headTo")} ${bilingual(s.toNode.name_bn, s.toNode.name_en, lang)}`}
                </p>
                {s.edge && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                    <span>
                      {Math.round(s.edge.distance)} {t("meters")}
                    </span>
                    {s.edge.has_ramp && (
                      <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md bg-warn/15 text-foreground ring-1 ring-warn/30 text-[11px] font-semibold uppercase tracking-wide">
                        <ArrowRight className="size-3" aria-hidden /> {t("useRamp")}
                      </span>
                    )}
                    {s.edge.has_elevator && (
                      <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md bg-brand/10 text-brand ring-1 ring-brand/30 text-[11px] font-semibold uppercase tracking-wide">
                        <ArrowRight className="size-3" aria-hidden /> {t("useElevator")}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
