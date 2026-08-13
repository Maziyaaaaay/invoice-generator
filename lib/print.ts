/**
 * Prints with document.title swapped to the invoice number for the duration.
 * Browsers print this title as a page header/footer by default, and there is
 * no CSS API to suppress that — swapping the title is the only way to stop a
 * marketing tagline from appearing on a printed business invoice.
 */
export function triggerPrint(invoiceNumber?: string): void {
  if (typeof window === "undefined") return;
  const original = document.title;
  const printTitle = invoiceNumber?.trim() ? `Invoice ${invoiceNumber.trim()}` : "Invoice";

  let restored = false;
  const restore = () => {
    if (restored) return;
    restored = true;
    document.title = original;
    window.removeEventListener("afterprint", restore);
  };

  document.title = printTitle;
  window.addEventListener("afterprint", restore);
  // Safety net: afterprint doesn't fire reliably in every browser/print flow.
  setTimeout(restore, 5000);

  window.print();
}
