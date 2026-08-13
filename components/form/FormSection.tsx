"use client";

import { ReactNode, useState } from "react";
import { ChevronRight } from "lucide-react";

interface FormSectionProps {
  id: string;
  step: number;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean;
}

export function FormSection({
  id,
  step,
  title,
  subtitle,
  children,
  defaultOpen = true,
  forceOpen = false,
}: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  // Adjust state during render when the prop flips (the "storing information
  // from previous renders" pattern) instead of in an effect.
  const [prevForceOpen, setPrevForceOpen] = useState(forceOpen);
  if (forceOpen !== prevForceOpen) {
    setPrevForceOpen(forceOpen);
    if (forceOpen) setOpen(true);
  }

  return (
    <section id={id} className="card overflow-hidden transition-shadow duration-200 hover:shadow-[0_2px_14px_rgba(20,21,26,0.04)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 p-5 text-left transition-colors duration-150 hover:bg-[var(--soft)] sm:p-6"
      >
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold text-white transition-transform duration-200"
            style={{ background: "var(--accent-safe)" }}
          >
            {step}
          </span>
          <div>
            <h2 className="text-[15.5px] font-bold tracking-tight text-[var(--ink)]">{title}</h2>
            {subtitle && <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--muted)]">{subtitle}</p>}
          </div>
        </div>
        <ChevronRight
          size={16}
          className="mt-1.5 flex-none text-[var(--muted)] transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[var(--line)] p-5 sm:p-6">{children}</div>
        </div>
      </div>
    </section>
  );
}
