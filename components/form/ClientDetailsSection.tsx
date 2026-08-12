"use client";

import { useInvoice } from "@/context/InvoiceContext";
import { FormSection } from "./FormSection";
import { Input } from "../ui/Input";

export function ClientDetailsSection({ errorMap }: { errorMap: Record<string, string> }) {
  const { state, dispatch } = useInvoice();
  const c = state.client;

  return (
    <FormSection
      id="client"
      step={2}
      title="Billed to"
      forceOpen={Object.keys(errorMap).some((k) => k.startsWith("client."))}
    >
      <Input
        fieldName="client.name"
        label="Client or brand"
        required
        placeholder="Enter client or brand name"
        value={c.name}
        error={errorMap["client.name"]}
        onChange={(e) => dispatch({ type: "SET_CLIENT", patch: { name: e.target.value } })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Contact person"
          placeholder="Enter contact name"
          value={c.contactPerson}
          onChange={(e) => dispatch({ type: "SET_CLIENT", patch: { contactPerson: e.target.value } })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter their email"
          value={c.email}
          onChange={(e) => dispatch({ type: "SET_CLIENT", patch: { email: e.target.value } })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="City"
          placeholder="Enter city"
          value={c.city}
          onChange={(e) => dispatch({ type: "SET_CLIENT", patch: { city: e.target.value } })}
        />
        <Input
          label="Country"
          placeholder="Enter country"
          value={c.country}
          onChange={(e) => dispatch({ type: "SET_CLIENT", patch: { country: e.target.value } })}
        />
      </div>
      <Input
        label="Their tax ID"
        placeholder="Optional"
        value={c.taxId}
        onChange={(e) => dispatch({ type: "SET_CLIENT", patch: { taxId: e.target.value } })}
      />
    </FormSection>
  );
}
