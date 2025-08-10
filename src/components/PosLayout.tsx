"use client";

import * as React from "react";
import { PosHeader } from "@/components/PosHeader";

export function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
        <PosHeader />
        {children}
    </div>
  );
}
