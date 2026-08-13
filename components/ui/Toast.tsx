"use client";

import { ReactNode } from "react";
import { ToastContext, useToastState } from "@/hooks/useToast";

export function ToastProvider({ children }: { children: ReactNode }) {
  const value = useToastState();
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="no-print fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 pointer-events-none">
        {value.toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-white shadow-lg animate-toast-in max-w-[90vw] text-center"
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
