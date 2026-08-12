"use client";

import { ChangeEvent, useId, useState } from "react";
import { useInvoice } from "@/context/InvoiceContext";
import { useToast } from "@/hooks/useToast";
import { extractDominantColor } from "@/lib/color";

const MAX_DIMENSION = 320;

function downscaleImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image decode failed"));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function LogoUploader() {
  const { state, dispatch, setLogoAccent } = useInvoice();
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const inputId = useId();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 4_000_000) {
      showToast("Logo too large — use an image under 4 MB");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await downscaleImage(file);
      dispatch({ type: "SET_LOGO", dataUrl });

      const img = new window.Image();
      img.onload = () => {
        const color = extractDominantColor(img);
        if (color) {
          setLogoAccent(color);
          dispatch({ type: "SET_DESIGN", patch: { accentColor: color } });
        }
      };
      img.src = dataUrl;
      showToast("Logo added");
    } catch {
      showToast("Couldn't read that image — try another file");
    } finally {
      setBusy(false);
    }
  }

  function handleRemove() {
    dispatch({ type: "SET_LOGO", dataUrl: "" });
    setLogoAccent("");
  }

  return (
    <div className="field">
      <label className="field-label" htmlFor={inputId}>
        Logo — optional
      </label>
      <div className="flex items-center gap-3">
        {state.profile.logoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={state.profile.logoDataUrl}
            alt="Your logo"
            className="h-12 w-12 rounded-lg border border-[var(--line)] object-contain bg-white p-1"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg border border-dashed border-[var(--line)] bg-[var(--soft)]" />
        )}
        <div className="flex-1">
          <input
            id={inputId}
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={busy}
            className="block w-full text-[12.5px] text-[var(--muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--soft)] file:px-3.5 file:py-2 file:text-[12.5px] file:font-semibold file:text-[var(--ink)] hover:file:bg-[var(--line)]"
          />
          {state.profile.logoDataUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-1 text-[11.5px] font-semibold text-[var(--muted)] underline underline-offset-2 hover:text-[#C0392B]"
            >
              Remove logo
            </button>
          )}
        </div>
      </div>
      <p className="field-hint">We&apos;ll suggest an accent colour pulled from your logo.</p>
    </div>
  );
}
