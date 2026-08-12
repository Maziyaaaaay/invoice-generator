"use client";

import { useId, useState } from "react";
import { useInvoice } from "@/context/InvoiceContext";
import { useToast } from "@/hooks/useToast";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { buildPersonalLink } from "@/lib/shareLink";
import { copyToClipboard } from "@/lib/share";
import { Button } from "../ui/Button";

export function PersonalLinkPanel() {
  const { state } = useInvoice();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const titleId = useId();

  useEscapeKey(() => setOpen(false), open);

  function handleOpen() {
    const url = buildPersonalLink(state.profile);
    if (!url) {
      showToast("Could not build the link");
      return;
    }
    setLink(url);
    setOpen(true);
  }

  async function handleCopy() {
    const result = await copyToClipboard(link);
    showToast(result === "copied" ? "Copied — keep it private" : "Couldn't copy — select and copy manually");
  }

  return (
    <>
      <Button size="sm" variant="ghost" onClick={handleOpen}>
        Get my personal link
      </Button>

      {open && (
        <div
          className="animate-overlay-in fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/45 p-4 no-print"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="animate-modal-in w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[88vh] overflow-y-auto"
          >
            <h3 id={titleId} className="text-lg font-bold tracking-tight text-[var(--ink)]">
              Your personal link
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Bookmark this or message it to yourself. Open it on any device and your details
              are already filled in.
            </p>
            <div className="mt-3 rounded-lg bg-[#FBEFEC] px-3.5 py-3 text-[12.5px] leading-relaxed text-[#8A3324]">
              <b>Keep this private.</b> Your payment details are inside the link itself. Don&apos;t
              post it anywhere public.
            </div>
            <div className="mt-3 max-h-24 overflow-y-auto break-all rounded-lg border border-[var(--line)] bg-[var(--soft)] p-2.5 font-mono text-[11.5px]">
              {link}
            </div>
            <div className="mt-4 flex gap-2.5">
              <Button variant="ghost" full onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button full onClick={handleCopy}>
                Copy link
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
