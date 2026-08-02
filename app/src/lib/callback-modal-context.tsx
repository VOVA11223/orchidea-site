"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type CallbackModalCtx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const Ctx = createContext<CallbackModalCtx | null>(null);

export function CallbackModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return <Ctx.Provider value={{ isOpen, open, close }}>{children}</Ctx.Provider>;
}

export function useCallbackModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCallbackModal must be used inside CallbackModalProvider");
  return ctx;
}
