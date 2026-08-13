"use client";

import { CSSProperties } from "react";
import { useInvoice } from "@/context/InvoiceContext";
import { getReadableInk, darkenToContrast } from "@/lib/color";
import { getCurrency, formatMoney } from "@/lib/currency";
import { grandTotal } from "@/lib/calculations";
import { THEMES } from "@/lib/themes";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewPartyBlock } from "./PreviewPartyBlock";
import { PreviewLineItems } from "./PreviewLineItems";
import { PreviewTotals } from "./PreviewTotals";
import { PreviewNotes } from "./PreviewNotes";

export function InvoicePreview() {
  const { state } = useInvoice();
  const { profile, client, items, meta, design, taxLabel, taxRate, overallDiscountPercent, notes } = state;

  const accent = design.accentColor || "#5B4CF0";
  const accentInk = getReadableInk(accent);
  const accentSafe = darkenToContrast(accent, "#ffffff", 4.5);
  const locale = getCurrency(meta.currency).locale;
  const t = THEMES[design.theme];

  const inverted = design.theme === "mono";
  const showAccentBar = design.theme === "aurora";

  const style: CSSProperties = {
    ["--accent" as string]: accent,
    ["--accent-ink" as string]: accentInk,
    ["--accent-safe" as string]: accentSafe,
  };

  const senderAddress = [
    profile.address.street,
    [profile.address.city, profile.address.state, profile.address.zip].filter(Boolean).join(", "),
    profile.address.country,
    profile.email,
    profile.phone,
  ].filter(Boolean);

  const clientAddress = [
    client.contactPerson,
    [client.city, client.country].filter(Boolean).join(", "),
    client.email,
    client.taxId ? `Tax ID: ${client.taxId}` : "",
  ].filter(Boolean);

  const paymentLines: string[] = [];
  if (profile.payment.accountName) paymentLines.push(`Account name: ${profile.payment.accountName}`);
  if (profile.payment.accountNumber) paymentLines.push(`Account no.: ${profile.payment.accountNumber}`);
  if (profile.payment.routingCode) paymentLines.push(`IFSC / SWIFT: ${profile.payment.routingCode}`);
  if (profile.payment.bankName) paymentLines.push(`Bank: ${profile.payment.bankName}`);
  if (profile.payment.upiOrPaypal) paymentLines.push(`UPI / PayPal: ${profile.payment.upiOrPaypal}`);

  const total = grandTotal(items, taxRate, overallDiscountPercent);

  return (
    <div
      id="invoice-preview"
      style={style}
      className={`${t.paper} rounded-[20px] border border-[var(--line)] bg-white p-8 shadow-sm sm:p-10`}
    >
      {showAccentBar && (
        <div
          className="-mx-8 -mt-8 mb-7 h-2 rounded-t-[20px] sm:-mx-10 sm:-mt-10"
          style={{ background: `linear-gradient(90deg, ${accentSafe}, ${accent})` }}
        />
      )}
      {inverted ? (
        <div
          className="-mx-8 -mt-8 mb-7 rounded-t-[20px] px-8 pt-8 pb-6 sm:-mx-10 sm:-mt-10 sm:px-10 sm:pt-10"
          style={{ background: accentSafe, color: accentInk }}
        >
          <PreviewHeader
            meta={meta}
            theme={design.theme}
            logoDataUrl={profile.logoDataUrl}
            taxId={profile.taxId}
            locale={locale}
            inverted
          />
        </div>
      ) : (
        <PreviewHeader
          meta={meta}
          theme={design.theme}
          logoDataUrl={profile.logoDataUrl}
          taxId={profile.taxId}
          locale={locale}
          inverted={false}
        />
      )}

      <div className="my-6 grid grid-cols-2 gap-6 avoid-break">
        <PreviewPartyBlock heading="From" name={profile.businessName || "Your name"} lines={senderAddress} />
        <PreviewPartyBlock heading="Billed to" name={client.name || "Client name"} lines={clientAddress} />
      </div>

      <PreviewLineItems items={items} currency={meta.currency} theme={design.theme} />
      <PreviewTotals
        items={items}
        taxLabel={taxLabel}
        taxRate={taxRate}
        overallDiscountPercent={overallDiscountPercent}
        currency={meta.currency}
        theme={design.theme}
      />

      <div className="mt-6 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-5 avoid-break">
        <div>
          <h3 className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.11em] text-[var(--muted)]">
            Payment details
          </h3>
          <div className="text-[12.5px] leading-relaxed text-[#3A3F44]">
            {paymentLines.length ? paymentLines.map((l) => <div key={l}>{l}</div>) : "—"}
          </div>
        </div>
        <div>
          <h3 className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.11em] text-[var(--muted)]">
            Reference
          </h3>
          <div className="text-[12.5px] leading-relaxed text-[#3A3F44]">
            {meta.invoiceNumber && <div>Invoice {meta.invoiceNumber}</div>}
            {client.name && <div>For {client.name}</div>}
            <div>Amount {formatMoney(total, meta.currency)}</div>
          </div>
        </div>
      </div>

      <PreviewNotes notes={notes} />
    </div>
  );
}
