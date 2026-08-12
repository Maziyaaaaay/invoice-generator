"use client";

import { Button } from "../ui/Button";

export function JumpToPreviewLink() {
  return (
    <div className="mt-1 lg:hidden">
      <Button
        variant="ghost"
        full
        onClick={() =>
          document.getElementById("preview-pane")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        See the invoice
      </Button>
    </div>
  );
}
