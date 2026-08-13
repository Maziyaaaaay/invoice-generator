"use client";

import { useId } from "react";
import { X } from "lucide-react";
import { useInvoice } from "@/context/InvoiceContext";
import { LineItem } from "@/lib/types";
import { lineAmount, lineGrossAmount } from "@/lib/calculations";
import { formatMoney } from "@/lib/currency";

export function LineItemRow({ item, canRemove }: { item: LineItem; canRemove: boolean }) {
  const { state, dispatch } = useInvoice();
  const gross = lineGrossAmount(item);
  const net = lineAmount(item);
  const hasDiscount = item.discountPercent > 0 && gross > 0;
  const uid = useId();
  const qtyId = `${uid}-qty`;
  const rateId = `${uid}-rate`;
  const discountId = `${uid}-discount`;

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
      <div className="grid grid-cols-3 gap-2">
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
        <div>
          <label className="field-label" htmlFor={discountId}>
            Disc %
          </label>
          <input
            id={discountId}
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="any"
            placeholder="0"
            className="field-input"
            value={item.discountPercent}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_ITEM",
                id: item.id,
                patch: { discountPercent: parseFloat(e.target.value) || 0 },
              })
            }
          />
        </div>
      </div>
      <div className="mt-2 flex items-baseline justify-end gap-2 border-t border-[var(--line)] pt-2">
        {hasDiscount && (
          <span className="tnum text-[12px] text-[var(--muted)] line-through">
            {formatMoney(gross, state.meta.currency)}
          </span>
        )}
        <span className="tnum whitespace-nowrap text-[13.5px] font-bold text-[var(--ink)]">
          {net ? formatMoney(net, state.meta.currency) : "—"}
        </span>
      </div>
    </div>
  );
}
