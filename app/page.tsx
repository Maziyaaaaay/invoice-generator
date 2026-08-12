"use client";

import dynamic from "next/dynamic";

const InvoiceApp = dynamic(() => import("@/components/InvoiceApp").then((m) => m.InvoiceApp), {
  ssr: false,
});

export default function Home() {
  return <InvoiceApp />;
}
