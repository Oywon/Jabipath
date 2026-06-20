import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMapData } from "@/lib/map-data";
import { findPath } from "@/lib/dijkstra";
import { CampusMap } from "@/components/CampusMap";
import { DirectionsPanel } from "@/components/DirectionsPanel";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Aurora } from "@/components/Aurora";
import { AppLogo } from "@/components/AppLogo";
import { useT, useLang, bilingual } from "@/lib/i18n";
import { Accessibility, ArrowLeftRight, X, User as UserIcon, Search, Volume2, VolumeX, Minus, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { speak, isTTSAvailable } from "@/lib/tts";
import { t as tt } from "@/lib/i18n";
import { loadPublicProfile } from "@/lib/public-profile";

export default function MapPage() {
  const t = useT();
  const { lang } = useLang();

  const { data, isLoading } = useQuery({
    queryKey: ["map-data"],
    queryFn: getMapData,
    staleTime: 5 * 60_000,
  });

  const [disability, setDisability] = useState("none");
  const [showRamps, setShowRamps] = useState(true);
  const [showElevators, setShowElevators] = useState(true);
  const [startId, setStartId] = useState(null);
  const [endId, setEndId] = useState(null);
  const [search, setSearch] = useState("");
  const [pickMode, setPickMode] = useState("start");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);

  const clampZoom = (value) => Math.min(1.75, Math.max(0.75, Number(value.toFixed(2))));

  useEffect(() => {
    const profile = loadPublicProfile();
    setDisability(profile.disability ?? "none");
    setVoiceEnabled(!!profile.voiceEnabled);
  }, []);

  const route = useMemo(() => {
    if (!data || !startId || !endId || startId === endId) return null;
    return findPath(data.nodes, data.edges, startId, endId, disability);
  }, [data, startId, endId, disability]);

  const fare = useMemo(() => {
    if (!route) return null;
    const distance = route.distance;
    if (distance <= 120) return 10;
    if (distance <= 250) return 15;
    if (distance <= 400) return 20;
    if (distance <= 600) return 25;
    return 30;
  }, [route]);

  // Speak short feedback when a route is computed or unreachable
  useEffect(() => {
    if (!voiceEnabled || !startId || !endId) return;
    if (route) speak(tt("routeFoundVoice", lang), lang);
    else speak(tt("noRouteVoice", lang), lang);
  }, [route, startId, endId, voiceEnabled, lang]);

  const filteredNodes = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) {
      return data.nodes.filter(
        (n) =>
          n.type === "building" ||
          n.type === "landmark" ||
          n.type === "gate" ||
          n.type === "rickshaw_stand" ||
          n.type === "electric_cart_stand",
      );
    }
    return data.nodes.filter(
      (n) =>
        n.name_bn.toLowerCase().includes(q) || n.name_en.toLowerCase().includes(q),
    );
  }, [data, search]);

  function handleNodeClick(id) {
    if (!data) return;
    const clickedNode = data.nodes.find((n) => n.id === id);
    if (pickMode === "start") {
      setStartId(id);
      setPickMode("end");
    } else {
      setEndId(id);
      setPickMode("start");
    }
  }

  function swap() {
    setStartId(endId);
    setEndId(startId);
  }

  function clearRoute() {
    setStartId(null);
    setEndId(null);
    setPickMode("start");
  }

  function zoomIn() {
    setMapZoom((value) => clampZoom(value + 0.15));
  }

  function zoomOut() {
    setMapZoom((value) => clampZoom(value - 0.15));
  }

  function resetZoom() {
    setMapZoom(1);
  }

  const nodeById = (id) =>
    id && data ? data.nodes.find((n) => n.id === id) ?? null : null;

  const startNode = nodeById(startId);
  const endNode = nodeById(endId);

  return (
    <div className="relative flex flex-col h-dvh text-foreground overflow-hidden">
      <Aurora position="fixed" intensity={0.4} />

      {/* Header */}
      <header className="relative z-20 shrink-0 px-4 py-3 glass border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <AppLogo markClassName="size-9" />
          <h1 className="font-bengali font-semibold text-base hidden sm:block">
            জাবি পথ{" "}
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">/ JU Path</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          {isTTSAvailable() && (
            <button
              type="button"
              onClick={() => setVoiceEnabled((v) => !v)}
              aria-pressed={voiceEnabled}
              aria-label={t("voiceGuide")}
              title={t("voiceGuide")}
              className={`min-h-11 size-11 grid place-items-center rounded-full ring-1 transition ${
                voiceEnabled
                  ? "bg-brand-gradient text-white ring-transparent shadow-glow"
                  : "ring-white/10 bg-white/5 hover:bg-white/10 text-foreground"
              }`}
            >
              {voiceEnabled ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-wider text-foreground/90">
            <Accessibility className="size-3.5 text-violet" aria-hidden />
            {t(`d_${disability}`)}
          </span>
          <Link
            to="/profile"
            aria-label={t("profile")}
            className="min-h-11 size-11 grid place-items-center rounded-full ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <UserIcon className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 overflow-hidden">
        {/* Search + From/To */}
        <div className="absolute top-4 left-4 right-4 z-10 max-w-xl mx-auto space-y-2">
          <div className="flex items-center ring-1 ring-white/10 glass rounded-2xl shadow-elevated">
            <div className="pl-4 pr-2 text-muted-foreground">
              <Search className="size-4" aria-hidden />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className={`w-full py-3 bg-transparent outline-none text-base ${lang === "bn" ? "font-bengali" : ""}`}
              aria-label={t("searchPlaceholder")}
            />
            {(startId || endId) && (
              <button
                onClick={clearRoute}
                className="px-3 py-2 m-1 rounded-lg text-muted-foreground hover:bg-white/10"
                aria-label={t("clear")}
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-stretch gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <button
                onClick={() => setPickMode("start")}
                className={`text-left px-3 py-2 rounded-xl ring-1 transition ${
                  pickMode === "start"
                    ? "ring-brand bg-brand/15 ring-glow"
                    : "ring-white/10 glass"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {t("from")}
                </div>
                <div className={`text-sm font-medium truncate ${lang === "bn" ? "font-bengali" : ""}`}>
                  {startNode
                    ? bilingual(startNode.name_bn, startNode.name_en, lang)
                    : t("selectStart")}
                </div>
              </button>
              <button
                onClick={() => setPickMode("end")}
                className={`text-left px-3 py-2 rounded-xl ring-1 transition ${
                  pickMode === "end" ? "ring-accent bg-accent/15 ring-glow" : "ring-white/10 glass"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {t("to")}
                </div>
                <div className={`text-sm font-medium truncate ${lang === "bn" ? "font-bengali" : ""}`}>
                  {endNode ? bilingual(endNode.name_bn, endNode.name_en, lang) : t("selectDest")}
                </div>
              </button>
            </div>
            <button
              onClick={swap}
              disabled={!startId || !endId}
              aria-label={t("swap")}
              className="min-h-11 size-11 grid place-items-center rounded-xl ring-1 ring-white/10 glass hover:bg-white/10 disabled:opacity-40"
            >
              <ArrowLeftRight className="size-4" aria-hidden />
            </button>
          </div>

          {/* Search results dropdown */}
          {search.trim() && (
            <div className="rounded-2xl ring-1 ring-white/10 glass shadow-elevated max-h-64 overflow-y-auto">
              {filteredNodes.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">—</p>
              ) : (
                <ul role="listbox">
                  {filteredNodes.slice(0, 8).map((n) => (
                    <li key={n.id}>
                      <button
                        onClick={() => {
                          handleNodeClick(n.id);
                          setSearch("");
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-white/10 text-sm flex items-center justify-between gap-2 ${
                          lang === "bn" ? "font-bengali" : ""
                        }`}
                      >
                        <span>{bilingual(n.name_bn, n.name_en, lang)}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">
                          {n.type}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="absolute left-4 bottom-[44vh] sm:bottom-auto sm:top-44 z-10 flex flex-col gap-2">
          <button
            onClick={() => setShowRamps((s) => !s)}
            aria-pressed={showRamps}
            className={`min-h-11 px-3 py-2 rounded-xl shadow ring-1 text-xs font-semibold flex items-center gap-2 transition ${
              showRamps ? "bg-warn/15 text-warn ring-warn/40" : "glass ring-white/10 text-muted-foreground"
            }`}
          >
            <span className="size-2.5 rounded-sm bg-warn" aria-hidden />
            {t("ramps")}
          </button>
          <button
            onClick={() => setShowElevators((s) => !s)}
            aria-pressed={showElevators}
            className={`min-h-11 px-3 py-2 rounded-xl shadow ring-1 text-xs font-semibold flex items-center gap-2 transition ${
              showElevators ? "bg-brand/15 text-brand ring-brand/40" : "glass ring-white/10 text-muted-foreground"
            }`}
          >
            <span className="size-2.5 rounded-sm bg-brand" aria-hidden />
            {t("elevators")}
          </button>
        </div>

        <div className="absolute right-4 bottom-[44vh] sm:bottom-6 z-10 flex flex-col gap-2">
          <button
            onClick={zoomIn}
            aria-label={t("zoomIn")}
            title={t("zoomIn")}
            className="size-11 rounded-xl glass ring-1 ring-white/10 shadow-elevated grid place-items-center hover:bg-white/10"
          >
            <Plus className="size-4" aria-hidden />
          </button>
          <div className="size-11 rounded-xl glass ring-1 ring-white/10 shadow-elevated grid place-items-center text-xs font-semibold">
            {Math.round(mapZoom * 100)}%
          </div>
          <button
            onClick={zoomOut}
            aria-label={t("zoomOut")}
            title={t("zoomOut")}
            className="size-11 rounded-xl glass ring-1 ring-white/10 shadow-elevated grid place-items-center hover:bg-white/10"
          >
            <Minus className="size-4" aria-hidden />
          </button>
          <button
            onClick={resetZoom}
            aria-label={t("zoomReset")}
            title={t("zoomReset")}
            className="px-3 h-10 rounded-xl glass ring-1 ring-white/10 shadow-elevated text-xs font-semibold hover:bg-white/10 inline-flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            {t("zoomReset")}
          </button>
        </div>

        {/* Map */}
        <div className="absolute inset-0">
          {isLoading || !data ? (
            <div className="h-full grid place-items-center text-muted-foreground">Loading…</div>
          ) : (
            <div
              className="w-full h-full transition-transform duration-200 ease-out"
              style={{ transform: `scale(${mapZoom})`, transformOrigin: "center center" }}
            >
              <CampusMap
                nodes={data.nodes}
                edges={data.edges}
                startId={startId}
                endId={endId}
                routePath={route?.path ?? null}
                showRamps={showRamps}
                showElevators={showElevators}
                voiceEnabled={voiceEnabled}
                onNodeClick={handleNodeClick}
              />
            </div>
          )}
        </div>
      </main>

      {/* Bottom sheet */}
      <motion.section
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-30 shrink-0 max-h-[44vh] glass ring-1 ring-white/10 rounded-t-3xl shadow-elevated flex flex-col overflow-y-auto"
        aria-label={t("directions")}
      >
        <div className="w-12 h-1.5 bg-white/15 rounded-full mx-auto mt-3 mb-2 shrink-0" />
        {route ? (
          <DirectionsPanel path={route.path} edges={route.edges} distance={route.distance} fare={fare} />
        ) : startId && endId ? (
          <p className="px-6 py-8 text-center text-destructive font-medium">{t("noRoute")}</p>
        ) : (
          <DirectionsPanel path={null} edges={[]} distance={0} />
        )}
      </motion.section>
    </div>
  );
}
