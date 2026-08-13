"use client";

import { useInvoice } from "@/context/InvoiceContext";
import { grandTotal } from "@/lib/calculations";
import { formatMoney } from "@/lib/currency";
import { Button } from "../ui/Button";

export function MobileActionBar({
  onShare,
  onSave,
}: {
  onShare: () => void;
  onSave: () => void;
}) {
  const { state } = useInvoice();
  const total = grandTotal(state.items, state.taxRate, state.overallDiscountPercent);

  return (
    <div className="mobile-bar no-print fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] px-4 py-3 backdrop-blur-md pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-[var(--muted)]">
            Invoice
          </div>
          <div className="truncate text-[14px] font-semibold text-[var(--ink)]">
            {state.client.name ? `For ${state.client.name}` : "Ready when you are"}
            {total > 0 && <span className="tnum text-[var(--muted)]"> · {formatMoney(total, state.meta.currency)}</span>}
          </div>
        </div>
        <Button variant="ghost" onClick={onShare}>
          Share
        </Button>
        <Button onClick={onSave}>Save as PDF</Button>
      </div>
    </div>
  );
}
