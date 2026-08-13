"use client";

import { LineItem, ThemeName } from "@/lib/types";
import {
  subtotal,
  overallDiscountAmount,
  taxAmount,
  grandTotal,
  lineGrossAmount,
} from "@/lib/calculations";
import { formatMoney } from "@/lib/currency";
import { THEMES } from "@/lib/themes";

export function PreviewTotals({
  items,
  taxLabel,
  taxRate,
  overallDiscountPercent,
  currency,
  theme,
}: {
  items: LineItem[];
  taxLabel: string;
  taxRate: number;
  overallDiscountPercent: number;
  currency: string;
  theme: ThemeName;
}) {
  const gross = items.reduce((sum, item) => sum + lineGrossAmount(item), 0);
  const netAfterLineDiscounts = subtotal(items);
  const lineDiscounts = gross - netAfterLineDiscounts;
  const overallDiscount = overallDiscountAmount(items, overallDiscountPercent);
  const tax = taxAmount(items, taxRate, overallDiscountPercent);
  const total = grandTotal(items, taxRate, overallDiscountPercent);
  const t = THEMES[theme];

  return (
    <div className="ml-auto min-w-[240px] avoid-break">
      <div className="flex justify-between py-1 text-[13.5px]">
        <span>Subtotal</span>
        <span className="tnum">{formatMoney(gross, currency)}</span>
      </div>
      {lineDiscounts > 0 && (
        <div className="flex justify-between py-1 text-[13.5px] text-[var(--muted)]">
          <span>Line discounts</span>
          <span className="tnum">-{formatMoney(lineDiscounts, currency)}</span>
        </div>
      )}
      {overallDiscount > 0 && (
        <div className="flex justify-between py-1 text-[13.5px] text-[var(--muted)]">
          <span>Discount ({overallDiscountPercent}%)</span>
          <span className="tnum">-{formatMoney(overallDiscount, currency)}</span>
        </div>
      )}
      {!!taxRate && (
        <div className="flex justify-between py-1 text-[13.5px]">
          <span>
            {taxLabel || "Tax"} ({taxRate}%)
          </span>
          <span className="tnum">{formatMoney(tax, currency)}</span>
        </div>
      )}
      <div
        className={`mt-1.5 flex justify-between border-t-2 pt-2.5 ${t.grandTotal}`}
        style={{ borderColor: "var(--accent-safe)", color: "var(--accent-safe)" }}
      >
        <span>Total</span>
        <span className="tnum">{formatMoney(total, currency)}</span>
      </div>
    </div>
  );
}
