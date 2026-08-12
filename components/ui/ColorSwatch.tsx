"use client";

import clsx from "clsx";

interface ColorSwatchProps {
  color: string;
  active: boolean;
  onClick: () => void;
  label?: string;
}

export function ColorSwatch({ color, active, onClick, label }: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label ?? "Accent colour"}
      className={clsx(
        "h-8 w-8 rounded-full transition-all duration-150 ease-out hover:scale-110 active:scale-95",
        active
          ? "ring-2 ring-offset-2 ring-[var(--ink)] scale-110 shadow-md"
          : "ring-1 ring-black/10 hover:shadow-sm",
      )}
      style={{ background: color }}
    />
  );
}
