"use client";

import { ReactNode } from "react";

export function TwoPaneLayout({ form, preview }: { form: ReactNode; preview: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[440px_1fr] lg:gap-9 lg:items-start">
      <div className="no-print flex flex-col gap-4">{form}</div>
      <div className="lg:sticky lg:top-6 print:static" id="preview-pane">
        {preview}
      </div>
    </div>
  );
}
