
"use client";

import * as React from "react";
import { Box } from "lucide-react";
import Image from "next/image";
import { SidebarNav } from "./SidebarNav";


export function Sidebar() {
  const [storeName, setStoreName] = React.useState("Toko Cepat");
  const [logo, setLogo] = React.useState<string | null>(null);

  const loadSettings = React.useCallback(() => {
    const savedName = localStorage.getItem("storeName");
    const savedLogo = localStorage.getItem("storeLogo");
    if (savedName) setStoreName(savedName);
    if (savedLogo) setLogo(savedLogo);
  }, []);

  React.useEffect(() => {
    loadSettings();
    window.addEventListener('storage', loadSettings);
    return () => window.removeEventListener('storage', loadSettings);
  }, [loadSettings]);

  return (
    <aside className="w-64 bg-card border-r flex-col hidden md:flex sticky top-0 h-screen">
       <div className="py-4 px-4 md:px-8 border-b h-[73px] flex items-center">
         <div className="flex items-center gap-3">
            {logo ? (
                <Image src={logo} alt="Logo" width={32} height={32} className="object-contain" />
              ) : (
                <Box className="h-8 w-8 text-primary" />
              )}
            <h1 className="text-2xl font-headline font-bold text-foreground">
              {storeName}
            </h1>
          </div>
      </div>
      <SidebarNav />
    </aside>
  );
}
