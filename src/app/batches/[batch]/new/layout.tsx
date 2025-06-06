"use client";

import { Toaster } from "sonner";

export default function AddLogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <Toaster position="top-right" richColors />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
