"use client";

import { Suspense } from "react";
import AppLayout from "@/components/AppLayout";
import MessagesPageHandler from "@/components/MessagesPageHandler";

// ❌ Prevents static rendering
export const dynamic = "force-dynamic";

export default function MessagesPage() {
  return (
    <AppLayout>
      <Suspense
        fallback={<div className="text-center p-6">Loading chat UI...</div>}
      >
        <MessagesPageHandler />
      </Suspense>
    </AppLayout>
  );
}
