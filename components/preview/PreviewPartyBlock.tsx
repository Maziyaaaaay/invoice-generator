"use client";

export function PreviewPartyBlock({
  heading,
  name,
  lines,
}: {
  heading: string;
  name: string;
  lines: string[];
}) {
  return (
    <div>
      <h3 className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.11em] text-[var(--muted)]">
        {heading}
      </h3>
      <div className="text-[14.5px] font-semibold text-[var(--ink)]">{name}</div>
      <div className="mt-0.5 whitespace-pre-line text-[12.5px] leading-relaxed text-[#5C6166]">
        {lines.filter(Boolean).join("\n")}
      </div>
    </div>
  );
}
