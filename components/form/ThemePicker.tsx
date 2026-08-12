"use client";

import clsx from "clsx";
import { useInvoice } from "@/context/InvoiceContext";
import { THEMES, THEME_ORDER } from "@/lib/themes";

export function ThemePicker() {
  const { state, dispatch } = useInvoice();

  return (
    <div className="field">
      <label className="field-label">Design</label>
      <div className="grid grid-cols-4 gap-2">
        {THEME_ORDER.map((name) => {
          const theme = THEMES[name];
          const active = state.design.theme === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() => dispatch({ type: "SET_DESIGN", patch: { theme: name } })}
              className={clsx(
                "overflow-hidden rounded-xl border bg-white text-left transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
                active
                  ? "border-[var(--ink)] ring-2 ring-[var(--accent-safe)] ring-offset-1"
                  : "border-[var(--line)] hover:border-[var(--ink)]",
              )}
            >
              <span
                className="block h-8"
                style={{ background: theme.swatch }}
              />
              <span className="block px-2 py-1.5 text-[10.5px] font-semibold text-[var(--muted)]">
                {theme.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
