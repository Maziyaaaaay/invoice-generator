"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

export interface ToastMessage {
  id: number;
  text: string;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (text: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastState(): ToastContextValue {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((text: string) => {
    counter.current += 1;
    const id = counter.current;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return { toasts, showToast };
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
