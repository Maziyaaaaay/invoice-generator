"use client";

import { useMemo, useReducer, useState } from "react";
import { useInvoice } from "@/context/InvoiceContext";
import { useToast } from "@/hooks/useToast";
import { loadProfile, saveProfile, clearProfile } from "@/lib/storage";
import { FormSection } from "./FormSection";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { LogoUploader } from "./LogoUploader";
import { PersonalLinkPanel } from "./PersonalLinkPanel";

export function SenderDetailsSection({ errorMap }: { errorMap: Record<string, string> }) {
  const { state, dispatch } = useInvoice();
  const { showToast } = useToast();
  const [defaultOpen] = useState(() => !loadProfile());
  // isSaved is derived, not stored: it recomputes when the profile is edited
  // and when a save/clear bumps the version.
  const [storageVersion, bumpStorageVersion] = useReducer((v: number) => v + 1, 0);
  const p = state.profile;
  const isSaved = useMemo(() => {
    const stored = loadProfile();
    return !!stored && JSON.stringify(stored) === JSON.stringify(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, storageVersion]);

  function handleSave() {
    const ok = saveProfile(p);
    bumpStorageVersion();
    if (ok) {
      showToast("Saved on this device");
    } else {
      showToast("This browser is blocking saving — try turning off private mode");
    }
  }

  function handleClear() {
    if (typeof window !== "undefined" && !window.confirm("Remove your saved details from this device?")) {
      return;
    }
    clearProfile();
    dispatch({ type: "CLEAR_PROFILE" });
    bumpStorageVersion();
    showToast("Cleared");
  }

  return (
    <FormSection
      id="sender"
      step={1}
      defaultOpen={defaultOpen}
      forceOpen={Object.keys(errorMap).some((k) => k.startsWith("profile."))}
      title={
        <span className="flex items-center gap-2">
          Your details
          {isSaved && <span className="text-[11px] font-medium text-[var(--muted)]">· saved</span>}
        </span>
      }
      subtitle="The only section remembered on this device — everything below changes per invoice."
    >
      <Input
        fieldName="profile.businessName"
        label="Name or business"
        required
        placeholder="Enter your name or business name"
        value={p.businessName}
        error={errorMap["profile.businessName"]}
        onChange={(e) => dispatch({ type: "SET_PROFILE", patch: { businessName: e.target.value } })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          fieldName="profile.email"
          label="Email"
          type="email"
          required
          placeholder="Enter your email"
          value={p.email}
          error={errorMap["profile.email"]}
          onChange={(e) => dispatch({ type: "SET_PROFILE", patch: { email: e.target.value } })}
        />
        <Input
          label="Phone"
          placeholder="Enter your phone"
          value={p.phone}
          onChange={(e) => dispatch({ type: "SET_PROFILE", patch: { phone: e.target.value } })}
        />
      </div>

      <fieldset className="mb-3.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] p-3.5">
        <legend className="px-1 text-[11px] font-bold uppercase tracking-[0.09em] text-[var(--muted)]">
          Address
        </legend>
        <Input
          label="Street"
          placeholder="Enter street address"
          value={p.address.street}
          onChange={(e) => dispatch({ type: "SET_PROFILE_ADDRESS", patch: { street: e.target.value } })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            fieldName="profile.address.city"
            label="City"
            required
            placeholder="Enter city"
            value={p.address.city}
            error={errorMap["profile.address.city"]}
            onChange={(e) => dispatch({ type: "SET_PROFILE_ADDRESS", patch: { city: e.target.value } })}
          />
          <Input
            label="State / region"
            placeholder="Enter state"
            value={p.address.state}
            onChange={(e) => dispatch({ type: "SET_PROFILE_ADDRESS", patch: { state: e.target.value } })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="PIN / ZIP"
            placeholder="Enter postcode"
            value={p.address.zip}
            onChange={(e) => dispatch({ type: "SET_PROFILE_ADDRESS", patch: { zip: e.target.value } })}
          />
          <Input
            fieldName="profile.address.country"
            label="Country"
            required
            placeholder="Enter country"
            value={p.address.country}
            error={errorMap["profile.address.country"]}
            onChange={(e) => dispatch({ type: "SET_PROFILE_ADDRESS", patch: { country: e.target.value } })}
          />
        </div>
      </fieldset>

      <Input
        label="Tax ID — PAN, GSTIN, VAT no."
        placeholder="Enter tax ID (optional)"
        value={p.taxId}
        onChange={(e) => dispatch({ type: "SET_PROFILE", patch: { taxId: e.target.value } })}
      />

      <fieldset className="mb-3.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] p-3.5">
        <legend className="px-1 text-[11px] font-bold uppercase tracking-[0.09em] text-[var(--muted)]">
          Payment details
        </legend>
        <Input
          label="Account name"
          placeholder="Enter account holder name"
          value={p.payment.accountName}
          onChange={(e) => dispatch({ type: "SET_PROFILE_PAYMENT", patch: { accountName: e.target.value } })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Account no. / IBAN"
            placeholder="Enter account number"
            value={p.payment.accountNumber}
            onChange={(e) => dispatch({ type: "SET_PROFILE_PAYMENT", patch: { accountNumber: e.target.value } })}
          />
          <Input
            label="IFSC / SWIFT"
            placeholder="Enter code"
            value={p.payment.routingCode}
            onChange={(e) => dispatch({ type: "SET_PROFILE_PAYMENT", patch: { routingCode: e.target.value } })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Bank name"
            placeholder="Enter bank name"
            value={p.payment.bankName}
            onChange={(e) => dispatch({ type: "SET_PROFILE_PAYMENT", patch: { bankName: e.target.value } })}
          />
          <Input
            label="UPI / PayPal"
            placeholder="Optional"
            value={p.payment.upiOrPaypal}
            onChange={(e) => dispatch({ type: "SET_PROFILE_PAYMENT", patch: { upiOrPaypal: e.target.value } })}
          />
        </div>
      </fieldset>

      <LogoUploader />

      <div className="mt-4 flex flex-wrap gap-2.5">
        <Button size="sm" onClick={handleSave}>
          Save my details
        </Button>
        <PersonalLinkPanel />
        <Button size="sm" variant="ghost" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </FormSection>
  );
}
