import logoUrl from "../logo.svg";

export function AppLogo({ className = "", markClassName = "", textClassName = "", showText = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoUrl}
        alt=""
        aria-hidden
        className={`block shrink-0 rounded-xl object-cover ring-1 ring-white/10 shadow-glow ${markClassName}`}
      />
      {showText ? (
        <div className={`leading-tight ${textClassName}`}>
          <h1 className="font-bengali font-bold text-lg">জাবি পথ</h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            JU · Path
          </p>
        </div>
      ) : null}
    </div>
  );
}