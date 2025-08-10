
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreditCard, FileText, Box, Package, BookCopy, Users, Building, Settings } from "lucide-react";

const menuItems = [
  { href: "/transactions", icon: CreditCard, label: "Kasir" },
  { href: "/admin/inventory", icon: Package, label: "Manajemen Stok" },
  { href: "/admin/financials", icon: BookCopy, label: "Laporan Keuangan" },
  { href: "/admin/reports", icon: FileText, label: "Laporan Transaksi" },
  { href: "/admin/customers", icon: Users, label: "Data Konsumen" },
  { href: "/admin/users", icon: Users, label: "Manajemen Pengguna" },
  { href: "/admin/settings", icon: Settings, label: "Pengaturan Toko" },
];


export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r flex-col hidden md:flex">
       <div className="py-4 px-4 md:px-8 border-b h-[73px] flex items-center">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Box className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-foreground">
              Toko Cepat
            </h1>
          </div>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                    pathname === item.href && "bg-muted text-primary font-semibold"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
