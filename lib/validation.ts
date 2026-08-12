import { InvoiceState } from "./types";

export interface FieldError {
  field: string;
  message: string;
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function validateInvoice(state: InvoiceState): FieldError[] {
  const errors: FieldError[] = [];

  if (!state.profile.businessName.trim()) {
    errors.push({ field: "profile.businessName", message: "Your name or business is required" });
  }
  if (!state.profile.email.trim()) {
    errors.push({ field: "profile.email", message: "Your email is required" });
  } else if (!EMAIL_RE.test(state.profile.email.trim())) {
    errors.push({ field: "profile.email", message: "Enter a valid email" });
  }
  if (!state.profile.address.city.trim()) {
    errors.push({ field: "profile.address.city", message: "Your city is required" });
  }
  if (!state.profile.address.country.trim()) {
    errors.push({ field: "profile.address.country", message: "Your country is required" });
  }

  if (!state.client.name.trim()) {
    errors.push({ field: "client.name", message: "Client or brand name is required" });
  }

  const hasValidItem = state.items.some(
    (item) => item.description.trim() && item.qty > 0 && item.rate > 0,
  );
  if (!hasValidItem) {
    errors.push({ field: "items", message: "Add at least one billable line item" });
  }

  if (!state.meta.invoiceNumber.trim()) {
    errors.push({ field: "meta.invoiceNumber", message: "Invoice number is required" });
  }
  if (!state.meta.issueDate) {
    errors.push({ field: "meta.issueDate", message: "Issue date is required" });
  }
  if (!state.meta.dueDate) {
    errors.push({ field: "meta.dueDate", message: "Due date is required" });
  } else if (state.meta.issueDate && state.meta.dueDate < state.meta.issueDate) {
    errors.push({ field: "meta.dueDate", message: "Due date can't be before the issue date" });
  }

  return errors;
}
