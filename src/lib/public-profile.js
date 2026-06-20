const STORAGE_KEY = "ju-public-profile";

const DEFAULT_PROFILE = {
  fullName: "",
  disability: "none",
  voiceEnabled: false,
  onboarded: false,
};

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function loadPublicProfile() {
  const storage = getStorage();
  if (!storage) return { ...DEFAULT_PROFILE };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function savePublicProfile(profile) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...DEFAULT_PROFILE,
      ...profile,
    }),
  );
}
