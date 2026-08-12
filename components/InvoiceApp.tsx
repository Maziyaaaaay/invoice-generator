"use client";

import { useState } from "react";
import { InvoiceProvider, useInvoice } from "@/context/InvoiceContext";
import { ToastProvider } from "./ui/Toast";
import { useToast } from "@/hooks/useToast";
import { validateInvoice } from "@/lib/validation";
import { saveProfile } from "@/lib/storage";
import { triggerPrint } from "@/lib/print";
import { shareOrCopy } from "@/lib/share";
import { grandTotal } from "@/lib/calculations";
import { formatMoney } from "@/lib/currency";
import { TwoPaneLayout } from "./layout/TwoPaneLayout";
import { JumpToPreviewLink } from "./layout/JumpToPreviewLink";
import { MobileActionBar } from "./layout/MobileActionBar";
import { SenderDetailsSection } from "./form/SenderDetailsSection";
import { ClientDetailsSection } from "./form/ClientDetailsSection";
import { LineItemsSection } from "./form/LineItemsSection";
import { InvoiceDetailsSection } from "./form/InvoiceDetailsSection";
import { InvoicePreview } from "./preview/InvoicePreview";
import { ConfirmDialog } from "./ui/ConfirmDialog";

function Masthead() {
  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-3 py-7">
      <div className="flex items-center gap-3.5">
        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl font-serif text-lg italic font-medium text-white shadow-sm transition-transform duration-200 hover:rotate-3"
          style={{ background: "linear-gradient(135deg,#5B4CF0,#EC4899)" }}
        >
          I
        </div>
        <div>
          <h1 className="font-serif text-[22px] italic font-medium tracking-tight text-[var(--ink)]">
            Invoice Studio
          </h1>
          <span className="block text-[12.5px] leading-relaxed text-[var(--muted)]">
            Free. No sign-up. No limits.
          </span>
        </div>
      </div>
      <div className="rounded-full border border-[#CBDDD5] bg-[#E9F3EE] px-3.5 py-1.5 text-[12px] font-semibold tracking-wide text-[#1E4A3C]">
        Nothing leaves your device
      </div>
    </div>
  );
}

function Workspace() {
  const { state, pendingLinkProfile, acceptPendingLink, dismissPendingLink } = useInvoice();
  const { showToast } = useToast();
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});

  function focusField(field: string) {
    // Give the containing section's expand transition a moment to start
    // before measuring position, since it may currently be collapsed.
    setTimeout(() => {
      const el = document.querySelector(`[data-field="${field}"]`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = el.querySelector("input, textarea, select") as HTMLElement | null;
      setTimeout(() => input?.focus(), 350);
    }, 80);
  }

  function handleSaveAsPdf() {
    const errors = validateInvoice(state);
    if (errors.length) {
      const map: Record<string, string> = {};
      errors.forEach((e) => {
        map[e.field] = e.message;
      });
      setErrorMap(map);
      showToast(`${errors.length} required field${errors.length > 1 ? "s" : ""} still need attention`);
      focusField(errors[0].field);
      return;
    }
    setErrorMap({});
    saveProfile(state.profile);
    triggerPrint();
  }

  async function handleShare() {
    const total = grandTotal(state.items, state.taxRate);
    const text = `Invoice ${state.meta.invoiceNumber}${state.client.name ? ` for ${state.client.name}` : ""} — ${formatMoney(total, state.meta.currency)}`;
    const url = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";
    const result = await shareOrCopy({ title: "Invoice Studio", text, url });
    if (result === "copied") showToast("Link copied");
    if (result === "failed") showToast("Couldn't share — copy the link manually");
  }

  return (
    <>
      <Masthead />
      <TwoPaneLayout
        form={
          <>
            <SenderDetailsSection errorMap={errorMap} />
            <ClientDetailsSection errorMap={errorMap} />
            <LineItemsSection errorMap={errorMap} />
            <InvoiceDetailsSection errorMap={errorMap} />
            <JumpToPreviewLink />
          </>
        }
        preview={
          <div>
            <div className="no-print mb-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
              Preview
            </div>
            <InvoicePreview />
            <p className="no-print mt-3 text-[11.5px] leading-relaxed text-[var(--muted)]">
              This produces a professional invoice, not a guaranteed tax-compliant one. GST, VAT
              and sales-tax rules differ by country — check what yours require before sending.
            </p>
          </div>
        }
      />
      <MobileActionBar onShare={handleShare} onSave={handleSaveAsPdf} />
      <ConfirmDialog
        open={!!pendingLinkProfile}
        title="Load details from this link?"
        confirmLabel="Load my details"
        cancelLabel="Ignore"
        onConfirm={acceptPendingLink}
        onCancel={dismissPendingLink}
      >
        This link contains a saved sender profile, including payment details. Only continue if
        you opened this link yourself.
      </ConfirmDialog>
    </>
  );
}

export function InvoiceApp() {
  return (
    <ToastProvider>
      <InvoiceProvider>
        <div className="min-h-screen pb-28 lg:pb-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <Workspace />
            <footer className="no-print py-10 text-center text-[12px] leading-relaxed text-[var(--muted)]">
              Runs entirely in your browser. Your invoice details are stored on your device and
              are never uploaded.
              <br />
              Free forever, no account, no limits.
            </footer>
          </div>
        </div>
      </InvoiceProvider>
    </ToastProvider>
  );
}
