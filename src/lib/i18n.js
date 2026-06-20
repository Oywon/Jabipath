import { createContext, useContext } from "react";

export const dict = {
  appName: { bn: "জাবি পথ", en: "JU Path" },
  tagline: {
    bn: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়ের অ্যাক্সেসযোগ্য পথনির্দেশক",
    en: "Accessible wayfinding for Jahangirnagar University",
  },
  getStarted: { bn: "শুরু করুন", en: "Get Started" },
  signIn: { bn: "সাইন ইন", en: "Sign In" },
  signUp: { bn: "নিবন্ধন", en: "Sign Up" },
  signOut: { bn: "সাইন আউট", en: "Sign Out" },
  email: { bn: "ইমেইল", en: "Email" },
  password: { bn: "পাসওয়ার্ড", en: "Password" },
  fullName: { bn: "পুরো নাম", en: "Full Name" },
  continueGoogle: { bn: "গুগল দিয়ে চালিয়ে যান", en: "Continue with Google" },
  haveAccount: { bn: "ইতিমধ্যে অ্যাকাউন্ট আছে?", en: "Already have an account?" },
  noAccount: { bn: "অ্যাকাউন্ট নেই?", en: "No account?" },
  onboardingTitle: { bn: "আপনার প্রোফাইল সেট করুন", en: "Set up your profile" },
  onboardingSub: {
    bn: "আমরা আপনার প্রয়োজন অনুযায়ী সবচেয়ে নিরাপদ ও সহজ পথ দেখাবো।",
    en: "We'll suggest the safest and most accessible route for your needs.",
  },
  disability: { bn: "আপনার প্রয়োজনের ধরন", en: "Your accessibility need" },
  voiceGuide: { bn: "ভয়েস নির্দেশনা", en: "Voice guidance" },
  save: { bn: "সংরক্ষণ", en: "Save" },
  profile: { bn: "প্রোফাইল", en: "Profile" },
  map: { bn: "মানচিত্র", en: "Map" },
  from: { bn: "শুরু", en: "From" },
  to: { bn: "গন্তব্য", en: "To" },
  searchPlaceholder: { bn: "ভবন বা স্থান খুঁজুন", en: "Search building or place" },
  directions: { bn: "নির্দেশনা", en: "Directions" },
  noRoute: { bn: "কোনো অ্যাক্সেসযোগ্য পথ পাওয়া যায়নি", en: "No accessible route found" },
  pickTwo: { bn: "যাত্রা শুরু ও গন্তব্য নির্বাচন করুন", en: "Pick a start and destination" },
  swap: { bn: "অদলবদল", en: "Swap" },
  clear: { bn: "মুছুন", en: "Clear" },
  ramps: { bn: "হাঁটার পথ", en: "Walkways" },
  elevators: { bn: "লিফট", en: "Elevators" },
  fare: { bn: "ভাড়া", en: "Fare" },
  zoomIn: { bn: "জুম ইন", en: "Zoom in" },
  zoomOut: { bn: "জুম আউট", en: "Zoom out" },
  zoomReset: { bn: "রিসেট জুম", en: "Reset zoom" },
  accessibleOnly: { bn: "শুধু অ্যাক্সেসযোগ্য", en: "Accessible only" },
  minWalk: { bn: "মিনিট হাঁটা", en: "min walk" },
  meters: { bn: "মিটার", en: "m" },
  step: { bn: "ধাপ", en: "Step" },
  startRoute: { bn: "রাস্তা শুরু করুন", en: "Start Route" },
  selectStart: { bn: "শুরুর স্থান নির্বাচন করুন", en: "Select start" },
  selectDest: { bn: "গন্তব্য নির্বাচন করুন", en: "Select destination" },
  comingSoon: { bn: "শীঘ্রই আসছে", en: "Coming soon" },
  features: { bn: "বৈশিষ্ট্য", en: "Features" },
  featureMap: { bn: "অ্যাক্সেসযোগ্য মানচিত্র", en: "Accessible map" },
  featureMapDesc: {
    bn: "হাঁটার পথ, লিফট ও সমতল পথ চিহ্নিত করা।",
    en: "Walkways, elevators, and flat paths clearly marked.",
  },
  featureRoute: { bn: "স্মার্ট রুটিং", en: "Smart routing" },
  featureRouteDesc: {
    bn: "আপনার প্রয়োজন অনুযায়ী সিঁড়ি এড়িয়ে পথ।",
    en: "Routes that avoid stairs based on your profile.",
  },
  featureVoice: { bn: "ভয়েস নির্দেশনা", en: "Voice guidance" },
  featureVoiceDesc: {
    bn: "বাংলা ও ইংরেজিতে কথা বলে দিকনির্দেশ।",
    en: "Turn-by-turn voice cues in Bangla & English.",
  },
  language: { bn: "ভাষা", en: "Language" },
  // Disability options
  d_none: { bn: "কোনোটি নয়", en: "None" },
  d_wheelchair: { bn: "হুইলচেয়ার / চলাচল", en: "Wheelchair / mobility" },
  d_visual: { bn: "দৃষ্টি প্রতিবন্ধী", en: "Visually impaired" },
  d_hearing: { bn: "শ্রবণ প্রতিবন্ধী", en: "Hearing impaired" },
  d_cognitive: { bn: "জ্ঞানীয়", en: "Cognitive" },
  // Step verbs
  headTo: { bn: "যান", en: "Head to" },
  via: { bn: "মাধ্যমে", en: "via" },
  useRamp: { bn: "হাঁটার পথ ব্যবহার করুন", en: "Use the walkway" },
  useElevator: { bn: "লিফট ব্যবহার করুন", en: "Use the elevator" },
  arrive: { bn: "পৌঁছান", en: "Arrive at" },
  start: { bn: "শুরু", en: "Start" },
  back: { bn: "ফিরে যান", en: "Back" },
  // Voice / TTS
  playDirections: { bn: "নির্দেশনা শুনুন", en: "Play directions" },
  stopDirections: { bn: "থামুন", en: "Stop" },
  voiceUnsupported: {
    bn: "এই ব্রাউজারে ভয়েস সমর্থন নেই",
    en: "Voice not supported in this browser",
  },
  routeFoundVoice: { bn: "পথ পাওয়া গেছে।", en: "Route found." },
  noRouteVoice: { bn: "অ্যাক্সেসযোগ্য পথ পাওয়া যায়নি।", en: "No accessible route found." },
  signedInVoice: { bn: "সাইন ইন সফল হয়েছে।", en: "Signed in successfully." },
};

export function t(key, lang) {
  return dict[key][lang];
}

export const LangContext = createContext({ lang: "bn", setLang: () => {} });

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  const { lang } = useLang();
  return (key) => t(key, lang);
}

export function bilingual(bn, en, lang) {
  return lang === "bn" ? bn : en;
}
