import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Aurora({ position = "absolute", intensity = 1, className = "" }) {
  const reduced = useReducedMotion();
  const op = Math.max(0, Math.min(1, intensity));

  return (
    <div
      aria-hidden
      className={`pointer-events-none overflow-hidden ${
        position === "fixed" ? "fixed inset-0" : "absolute inset-0"
      } ${className}`}
      style={{ zIndex: 0, opacity: op }}
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-aurora" />

      {/* moving blobs */}
      <div
        className="absolute -top-[20%] -left-[10%] size-[55vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.55 0.28 285 / 0.65), transparent 60%)",
          animation: reduced ? undefined : "aurora 18s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -bottom-[25%] -right-[10%] size-[60vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.68 0.27 330 / 0.55), transparent 60%)",
          animation: reduced ? undefined : "aurora 28s ease-in-out infinite reverse",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[40vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.45 0.22 260 / 0.55), transparent 65%)",
          animation: reduced ? undefined : "aurora 22s ease-in-out infinite",
          filter: "blur(60px)",
        }}
      />

      {/* grain / vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.06 0.01 285 / 0.7) 100%)",
        }}
      />
    </div>
  );
}
