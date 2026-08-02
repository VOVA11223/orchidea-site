"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Settings {
  minOrder: number;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  whatsapp: string;
  telegram: string;
  max: string;
}

export const DEFAULT_SETTINGS: Settings = {
  minOrder: 10000,
  phone: "+7 903 374-31-37",
  email: "orchidea_opt@mail.ru",
  address: "ул. имени Менделеева, 72,\nВолгоград",
  workingHours: "Ежедневно с 8:00 до 17:00 (вс — выходной)",
  whatsapp: "https://wa.me/79033743137",
  telegram: "https://t.me/+79033743137",
  max: "https://max.ru/+79033743137",
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("orchidea_settings");
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("orchidea_settings", JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
