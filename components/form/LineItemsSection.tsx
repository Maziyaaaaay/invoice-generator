"use client";

import { Plus } from "lucide-react";
import { useInvoice } from "@/context/InvoiceContext";
import { grandTotal } from "@/lib/calculations";
import { formatMoney } from "@/lib/currency";
import { FormSection } from "./FormSection";
import { LineItemRow } from "./LineItemRow";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";

export function LineItemsSection({ errorMap }: { errorMap: Record<string, string> }) {
  const { state, dispatch } = useInvoice();
  const total = grandTotal(state.items, state.taxRate, state.overallDiscountPercent);

  return (
    <FormSection
      id="items"
      step={3}
      title="What you're billing for"
      forceOpen={!!errorMap["items"]}
    >
      <div data-field="items">
        {state.items.map((item) => (
          <LineItemRow key={item.id} item={item} canRemove={state.items.length > 1} />
        ))}
      </div>
      {errorMap["items"] && <p className="field-error -mt-1 mb-3">{errorMap["items"]}</p>}

      <Button variant="ghost" full size="sm" onClick={() => dispatch({ type: "ADD_ITEM" })}>
        <Plus size={14} /> Add another line
      </Button>

      <div className="mt-4">
        <Input
          label="Overall discount %"
          hint="Applied to the whole invoice, after per-line discounts and before tax"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          step="any"
          value={state.overallDiscountPercent}
          placeholder="0"
          onChange={(e) =>
            dispatch({ type: "SET_OVERALL_DISCOUNT", percent: parseFloat(e.target.value) || 0 })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Tax label"
          placeholder="GST / VAT"
          value={state.taxLabel}
          onChange={(e) => dispatch({ type: "SET_TAX", label: e.target.value })}
        />
        <Input
          label="Rate %"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={state.taxRate}
          placeholder="0"
          onChange={(e) => dispatch({ type: "SET_TAX", rate: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <Textarea
        label="Notes / terms"
        placeholder="Enter any payment terms or a thank you note"
        value={state.notes}
        onChange={(e) => dispatch({ type: "SET_NOTES", notes: e.target.value })}
      />

      <div className="flex items-baseline justify-between border-t border-[var(--line)] pt-3.5">
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
          Invoice total
        </span>
        <b className="tnum text-[19px] font-bold tracking-tight text-[var(--ink)]">
          {total ? formatMoney(total, state.meta.currency) : "—"}
        </b>
      </div>
    </FormSection>
  );
}
