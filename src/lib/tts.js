const LANG_CODE = { bn: "bn-BD", en: "en-US" };

function pickVoice(lang) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const want = LANG_CODE[lang];
  const langPrefix = want.split("-")[0];
  return (
    voices.find((v) => v.lang === want) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith(langPrefix)) ??
    voices.find((v) => v.default) ??
    voices[0] ??
    null
  );
}

export function isTTSAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function cancelSpeech() {
  if (!isTTSAvailable()) return;
  window.speechSynthesis.cancel();
}

export function speak(text, lang, opts = {}) {
  if (!isTTSAvailable() || !text.trim()) return;
  cancelSpeech();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANG_CODE[lang];
  const v = pickVoice(lang);
  if (v) u.voice = v;
  u.rate = opts.rate ?? 1;
  u.pitch = opts.pitch ?? 1;
  if (opts.onEnd) u.onend = opts.onEnd;
  window.speechSynthesis.speak(u);
}

export function speakSequence(parts, lang, opts = {}) {
  if (!isTTSAvailable() || parts.length === 0) {
    opts.onDone?.();
    return () => {};
  }
  cancelSpeech();
  let cancelled = false;
  const filtered = parts.map((p) => p.trim()).filter(Boolean);
  let i = 0;
  const next = () => {
    if (cancelled) return;
    if (i >= filtered.length) {
      opts.onDone?.();
      return;
    }
    const u = new SpeechSynthesisUtterance(filtered[i++]);
    u.lang = LANG_CODE[lang];
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.rate = opts.rate ?? 1;
    u.onend = () => {
      if (opts.gapMs && opts.gapMs > 0) {
        window.setTimeout(next, opts.gapMs);
      } else {
        next();
      }
    };
    u.onerror = () => next();
    window.speechSynthesis.speak(u);
  };
  next();
  return () => {
    cancelled = true;
    cancelSpeech();
  };
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    window.speechSynthesis.getVoices();
  });
}
