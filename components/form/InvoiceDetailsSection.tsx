"use client";

import { useInvoice } from "@/context/InvoiceContext";
import { CURRENCIES } from "@/lib/currency";
import { FormSection } from "./FormSection";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { ThemePicker } from "./ThemePicker";
import { AccentColorPicker } from "./AccentColorPicker";

export function InvoiceDetailsSection({ errorMap }: { errorMap: Record<string, string> }) {
  const { state, dispatch } = useInvoice();
  const m = state.meta;

  return (
    <FormSection
      id="details"
      step={4}
      title="Invoice details & design"
      defaultOpen={false}
      forceOpen={Object.keys(errorMap).some((k) => k.startsWith("meta."))}
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          fieldName="meta.invoiceNumber"
          label="Invoice number"
          value={m.invoiceNumber}
          error={errorMap["meta.invoiceNumber"]}
          onChange={(e) => dispatch({ type: "SET_META", patch: { invoiceNumber: e.target.value } })}
        />
        <Select
          label="Currency"
          value={m.currency}
          onChange={(e) => dispatch({ type: "SET_META", patch: { currency: e.target.value } })}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.symbol}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          fieldName="meta.issueDate"
          label="Date"
          type="date"
          value={m.issueDate}
          error={errorMap["meta.issueDate"]}
          onChange={(e) => dispatch({ type: "SET_META", patch: { issueDate: e.target.value } })}
        />
        <Input
          fieldName="meta.dueDate"
          label="Due"
          type="date"
          value={m.dueDate}
          error={errorMap["meta.dueDate"]}
          onChange={(e) => dispatch({ type: "SET_META", patch: { dueDate: e.target.value } })}
        />
      </div>

      <ThemePicker />
      <AccentColorPicker />
    </FormSection>
  );
}
