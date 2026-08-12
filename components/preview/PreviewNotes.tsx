"use client";

export function PreviewNotes({ notes }: { notes: string }) {
  if (!notes) return null;
  return (
    <div className="mt-5 whitespace-pre-line text-[12px] leading-relaxed text-[#5C6166]">{notes}</div>
  );
}
