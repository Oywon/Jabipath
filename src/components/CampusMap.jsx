import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLang, bilingual } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { speak } from "@/lib/tts";

export function CampusMap({
  nodes,
  edges,
  startId,
  endId,
  routePath,
  showRamps,
  showElevators,
  voiceEnabled = false,
  onNodeClick,
}) {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const routeRef = useRef(null);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const routeIds = new Set(routePath?.map((n) => n.id));
  const routePoints = routePath
    ? routePath.map((n) => `${n.x},${n.y}`).join(" ")
    : "";

  function handleClick(id, n) {
    onNodeClick(id);
    if (voiceEnabled) {
      speak(bilingual(n.name_bn, n.name_en, lang), lang, { rate: 1 });
    }
  }

  // GSAP stroke-draw whenever the route polyline changes
  useEffect(() => {
    if (reduced || !routeRef.current || !routePath || routePath.length < 2) return;
    const el = routeRef.current;
    const len = el.getTotalLength();
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    const tween = gsap.to(el, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [routePoints, routePath, reduced]);

  return (
    <svg
      viewBox="0 0 1000 1400"
      className="w-full h-full"
      role="img"
      aria-label={lang === "bn" ? "জাবি ক্যাম্পাস মানচিত্র" : "JU campus map"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="mapWash" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#fbfbf6" />
          <stop offset="100%" stopColor="#f4f6ee" />
        </radialGradient>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c8f40" />
          <stop offset="100%" stopColor="#a35e1b" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="1000" height="1400" fill="url(#mapWash)" />

      {/* Light campus boundary */}
      <path
        d="M 80 120 Q 25 420 55 650 Q 70 840 40 1080 Q 28 1260 150 1315 Q 300 1365 430 1340 Q 560 1310 705 1330 Q 845 1355 930 1265 Q 965 1000 940 720 Q 935 520 900 270 Q 870 150 760 80 Q 560 20 360 35 Q 170 45 80 120 Z"
        fill="none"
        stroke="#d8dfc8"
        strokeWidth="3"
      />

      {/* East edge reference strip from the provided map */}
      <rect x="950" y="0" width="50" height="1400" fill="#dfe7cf" opacity="0.75" />
      <path d="M 960 40 Q 972 720 960 1380" fill="none" stroke="#9fae7d" strokeWidth="6" strokeLinecap="round" />

      {/* Base edges (paths) */}
      {edges.map((e, i) => {
        const a = nodeMap.get(e.from_node);
        const b = nodeMap.get(e.to_node);
        if (!a || !b) return null;
        const inRoute =
          routePath &&
          routeIds.has(a.id) &&
          routeIds.has(b.id) &&
          Math.abs(
            routePath.findIndex((n) => n.id === a.id) -
              routePath.findIndex((n) => n.id === b.id),
          ) === 1;
        if (inRoute) return null;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={e.has_stairs ? "#c99a63" : "#8fa05a"}
            strokeWidth={e.has_stairs ? 3 : 4}
            strokeDasharray={e.has_stairs ? "6 6" : undefined}
            strokeLinecap="round"
          />
        );
      })}

      {/* Highlighted route polyline — glow halo + animated stroke */}
      {routePath && routePath.length > 1 && (
        <>
          <polyline
            points={routePoints}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="16"
            strokeOpacity="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
          <polyline
            ref={routeRef}
            points={routePoints}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* Nodes */}
      {nodes.map((n) => {
        const isRamp = n.type === "ramp";
        const isElev = n.type === "elevator";
        const isLandmark = n.type === "landmark";
        const isIntersection = n.type === "intersection";
        const isGate = n.type === "gate";
        const isRickshawStand = n.type === "rickshaw_stand";
        const isElectricCartStand = n.type === "electric_cart_stand";
        if (isRamp && !showRamps) return null;
        if (isElev && !showElevators) return null;

        const isStart = n.id === startId;
        const isEnd = n.id === endId;
        const onRoute = routeIds.has(n.id);
        const label = lang === "bn" ? n.name_bn : n.name_en;

        return (
          <g
            key={n.id}
            transform={`translate(${n.x}, ${n.y})`}
            className="cursor-pointer"
            onClick={() => handleClick(n.id, n)}
            tabIndex={0}
            role="button"
            aria-label={label}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(n.id, n);
              }
            }}
          >
            {n.type === "building" ? (
                <>
                  <rect
                    x={-14}
                    y={-14}
                    width={28}
                    height={28}
                    rx={5}
                    fill="#fefcf3"
                    stroke={isStart || isEnd ? "url(#routeGrad)" : onRoute ? "#7c8f40" : "#bac6a5"}
                    strokeWidth={isStart || isEnd ? 3 : 1.5}
                  />
                  <rect x={-7} y={-7} width={14} height={14} rx={2} fill="url(#routeGrad)" opacity="0.9" />
                </>
              ) : isGate ? (
                <>
                  <circle r={14} fill="#fbf7ea" stroke="#8c6b3e" strokeWidth={2.5} />
                  <path d="M -6,-6 L -6,6 M 6,-6 L 6,6 M -6,0 L 6,0" stroke="#8c6b3e" strokeWidth={2} fill="none" />
                </>
              ) : isRickshawStand ? (
                <>
                  <circle r={14} fill="#f8fbf2" stroke="#6b8a42" strokeWidth={2.5} />
                  <circle cx={-6} cy={6} r={2.8} fill="#6b8a42" />
                  <circle cx={6} cy={6} r={2.8} fill="#6b8a42" />
                  <path d="M -7,3 L -1,-5 H 5 L 9,1" fill="none" stroke="#6b8a42" strokeWidth={2} strokeLinejoin="round" />
                  <path d="M -1,-5 L -1,1 M 5,-5 L 5,1" fill="none" stroke="#6b8a42" strokeWidth={2} />
                </>
              ) : isElectricCartStand ? (
                <>
                  <circle r={14} fill="#f8fbf2" stroke="#4d8a65" strokeWidth={2.5} />
                  <path d="M -2,-7 L 4,-1 H 0 L 3,7 L -5,0 H -1 Z" fill="#4d8a65" />
                  <circle cx={-5} cy={6} r={2.5} fill="#4d8a65" />
                  <circle cx={5} cy={6} r={2.5} fill="#4d8a65" />
                </>
              ) : isRamp ? (
                <>
                  <circle r={12} fill="#f8fbf2" stroke="#c78a3e" strokeWidth={2} />
                  <polygon points="-6,5 6,5 0,-6" fill="#c78a3e" />
                </>
              ) : isElev ? (
                <>
                  <circle r={12} fill="#f8fbf2" stroke="#5c7f59" strokeWidth={2} />
                  <rect x={-5} y={-5} width={10} height={10} fill="#5c7f59" />
                </>
              ) : isLandmark ? (
                <>
                  <circle r={10} fill="#6d8f4a" stroke="#d7e1c0" strokeWidth={1.5} />
                  <circle r={3} fill="#ffffff" />
                </>
              ) : isIntersection ? (
                <circle r={4} fill="#7a8b62" />
              ) : (
                <circle r={6} fill="#6d8f4a" />
              )}

              {/* Start/End rings */}
              {(isStart || isEnd) && (
                <circle r={26} fill="none" stroke="#a05e1b" strokeWidth={2} opacity="0.75">
                  {!reduced && (
                    <>
                      <animate attributeName="r" values="22;32;22" dur="2.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.2s" repeatCount="indefinite" />
                    </>
                  )}
                </circle>
              )}

              {n.type !== "intersection" && !isRickshawStand && !isElectricCartStand && (
                <text
                  y={n.type === "building" ? 28 : 30}
                  textAnchor="middle"
                  className={lang === "bn" ? "font-bengali" : ""}
                  fontSize="13"
                  fontWeight="600"
                  fill="#3f4f31"
                  style={{ paintOrder: "stroke", stroke: "#f8f5ea", strokeWidth: 4 }}
                >
                  {label}
                </text>
              )}

              {(isRickshawStand || isElectricCartStand) && (
                <text
                  y={30}
                  textAnchor="middle"
                  className={lang === "bn" ? "font-bengali" : ""}
                  fontSize="12"
                  fontWeight="600"
                  fill={isRickshawStand ? "#49612c" : "#3f6f52"}
                >
                  {label}
                </text>
              )}
          </g>
        );
      })}
    </svg>
  );
}
