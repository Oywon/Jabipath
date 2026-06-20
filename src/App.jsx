import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { LangContext } from "@/lib/i18n";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import MapPage from "@/pages/Map";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  const [lang, setLangState] = useState("bn");

  useEffect(() => {
    const stored = localStorage.getItem("ju-lang");
    if (stored === "bn" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  function setLang(l) {
    setLangState(l);
    localStorage.setItem("ju-lang", l);
    document.documentElement.lang = l;
  }

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <QueryClientProvider client={queryClient}>
      <LangContext.Provider value={{ lang, setLang }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Navigate to="/map" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/profile" element={<Profile />} />

            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-center" />
      </LangContext.Provider>
    </QueryClientProvider>
  );
}
