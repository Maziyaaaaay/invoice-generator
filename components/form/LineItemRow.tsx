"use client";

import { useId } from "react";
import { X } from "lucide-react";
import { useInvoice } from "@/context/InvoiceContext";
import { LineItem } from "@/lib/types";
import { lineAmount } from "@/lib/calculations";
import { formatMoney } from "@/lib/currency";

export function LineItemRow({ item, canRemove }: { item: LineItem; canRemove: boolean }) {
  const { state, dispatch } = useInvoice();
  const amount = lineAmount(item);
  const uid = useId();
  const qtyId = `${uid}-qty`;
  const rateId = `${uid}-rate`;

  return (
    <div className="mb-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] p-3 transition-colors duration-150 focus-within:border-[var(--accent-safe)] focus-within:bg-white hover:border-[#c9c6bd]">
      <div className="mb-2.5 flex items-start gap-2">
        <input
          className="field-input flex-1"
          aria-label="Description"
          placeholder="Enter the service you provided"
          value={item.description}
          onChange={(e) =>
            dispatch({ type: "UPDATE_ITEM", id: item.id, patch: { description: e.target.value } })
          }
        />
        <button
          type="button"
          title="Remove line"
          onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
          disabled={!canRemove}
          className="flex h-[42px] w-9 flex-none items-center justify-center rounded-lg border border-[var(--line)] bg-white text-[var(--muted)] transition-colors hover:border-[#C0392B] hover:text-[#C0392B] disabled:opacity-30"
        >
          <X size={15} />
        </button>
      </div>
      <div className="grid grid-cols-[1fr_1.3fr_auto] items-end gap-2">
        <div>
          <label className="field-label" htmlFor={qtyId}>
            Qty
          </label>
          <input
            id={qtyId}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            className="field-input"
            value={item.qty}
            onChange={(e) =>
              dispatch({ type: "UPDATE_ITEM", id: item.id, patch: { qty: parseFloat(e.target.value) || 0 } })
            }
          />
        </div>
        <div>
          <label className="field-label" htmlFor={rateId}>
            Rate
          </label>
          <input
            id={rateId}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder="0"
            className="field-input"
            value={item.rate}
            onChange={(e) =>
              dispatch({ type: "UPDATE_ITEM", id: item.id, patch: { rate: parseFloat(e.target.value) || 0 } })
            }
          />
        </div>
        <div className="tnum whitespace-nowrap pb-2.5 text-[13.5px] font-bold text-[var(--ink)]">
          {amount ? formatMoney(amount, state.meta.currency) : "—"}
        </div>
      </div>
    </div>
  );
}
