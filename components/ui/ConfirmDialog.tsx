"use client";

import { ReactNode, useId } from "react";
import { Button } from "./Button";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  useEscapeKey(onCancel, open);
  if (!open) return null;
  return (
    <div
      className="animate-overlay-in fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/45 p-4 no-print"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-modal-in w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h3 id={titleId} className="text-lg font-bold tracking-tight text-[var(--ink)]">
          {title}
        </h3>
        <div className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{children}</div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" full onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button full onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
