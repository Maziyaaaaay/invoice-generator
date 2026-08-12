"use client";

import { InvoiceMeta, ThemeName } from "@/lib/types";
import { THEMES } from "@/lib/themes";

function formatDate(v: string, locale: string): string {
  if (!v) return "";
  const d = new Date(`${v}T00:00:00`);
  if (isNaN(d.getTime())) return v;
  return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

export function PreviewHeader({
  meta,
  theme,
  logoDataUrl,
  taxId,
  locale,
  inverted,
}: {
  meta: InvoiceMeta;
  theme: ThemeName;
  logoDataUrl: string;
  taxId: string;
  locale: string;
  inverted: boolean;
}) {
  const t = THEMES[theme];
  const mutedColor = inverted ? "rgba(255,255,255,0.75)" : "var(--muted)";

  return (
    <div
      className="flex items-start justify-between gap-6 pb-5"
      style={{
        borderBottom: inverted
          ? "none"
          : `${t.dividerWidth} ${t.dividerStyle} var(--accent-safe)`,
      }}
    >
      <div>
        {logoDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoDataUrl} alt="" className="mb-2.5 block max-h-12 max-w-[170px] object-contain" />
        )}
        <h2 className={t.heading} style={{ color: inverted ? "#fff" : "var(--accent-safe)" }}>
          Invoice
        </h2>
        <div className="mt-0.5 text-[12.5px]" style={{ color: mutedColor }}>
          {meta.invoiceNumber ? `No. ${meta.invoiceNumber}` : ""}
        </div>
      </div>
      <div className="flex-none text-right text-[12.5px] leading-relaxed" style={{ color: inverted ? "#fff" : "var(--ink)" }}>
        {meta.issueDate && (
          <div>
            <b className="font-semibold">Issued</b> {formatDate(meta.issueDate, locale)}
          </div>
        )}
        {meta.dueDate && (
          <div>
            <b className="font-semibold">Due</b> {formatDate(meta.dueDate, locale)}
          </div>
        )}
        {taxId && <div className="opacity-75">{taxId}</div>}
      </div>
    </div>
  );
}
