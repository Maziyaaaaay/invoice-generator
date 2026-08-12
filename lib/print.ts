export function triggerPrint(): void {
  if (typeof window === "undefined") return;
  window.print();
}
