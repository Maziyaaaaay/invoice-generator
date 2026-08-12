"use client";

import { useInvoice } from "@/context/InvoiceContext";
import { ColorSwatch } from "../ui/ColorSwatch";

const BASE_ACCENTS = ["#5B4CF0", "#16181C", "#1E7A5C", "#C0392B", "#B5842A", "#23405F"];

export function AccentColorPicker() {
  const { state, dispatch, logoAccent } = useInvoice();

  const swatches = [...BASE_ACCENTS];
  if (logoAccent && !swatches.includes(logoAccent)) swatches.push(logoAccent);

  return (
    <div className="field">
      <label className="field-label">Accent colour</label>
      <div className="flex flex-wrap items-center gap-2.5">
        {swatches.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            active={state.design.accentColor.toLowerCase() === color.toLowerCase()}
            onClick={() => dispatch({ type: "SET_DESIGN", patch: { accentColor: color } })}
          />
        ))}
        <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ring-1 ring-black/10">
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)",
            }}
          />
          <input
            type="color"
            value={state.design.accentColor}
            onChange={(e) => dispatch({ type: "SET_DESIGN", patch: { accentColor: e.target.value } })}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Custom accent colour"
          />
        </label>
      </div>
      {logoAccent && (
        <p className="field-hint">The last swatch was pulled from your logo.</p>
      )}
    </div>
  );
}
