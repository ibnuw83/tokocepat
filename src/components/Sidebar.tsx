
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreditCard, FileText, Box, Package, BookCopy, Users, Building, Settings, LayoutDashboard, UserCog } from "lucide-react";
import Image from "next/image";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const allMenuItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: CreditCard, label: "Kasir" },
  { href: "/admin/inventory", icon: Package, label: "Manajemen Stok" },
  { href: "/admin/financials", icon: BookCopy, label: "Laporan Keuangan" },
  { href: "/admin/reports", icon: FileText, label: "Laporan Transaksi" },
  { href: "/admin/customers", icon: Users, label: "Data Konsumen" },
  { href: "/admin/users", icon: UserCog, label: "Manajemen Pengguna" },
  { href: "/admin/settings", icon: Settings, label: "Pengaturan Toko" },
];

const cashierMenuItems = [
    { href: "/transactions", icon: CreditCard, label: "Kasir" },
    { href: "/admin/reports", icon: FileText, label: "Laporan Transaksi" },
]


export function Sidebar() {
  const pathname = usePathname();
  const [storeName, setStoreName] = React.useState("Toko Cepat");
  const [logo, setLogo] = React.useState<string | null>(null);
  const [menuItems, setMenuItems] = React.useState(allMenuItems);

  React.useEffect(() => {
    const settingsQuery = query(collection(db, "settings"));
    const unsubscribe = onSnapshot(settingsQuery, (snapshot) => {
        if (!snapshot.empty) {
            const settingsData = snapshot.docs[0].data();
            setStoreName(settingsData.storeName || "Toko Cepat");
            setLogo(settingsData.logo || null);
        }
    });

    const userRole = sessionStorage.getItem("userRole");
    if (userRole === 'Kasir') {
        setMenuItems(cashierMenuItems);
    } else {
        setMenuItems(allMenuItems);
    }

    return () => unsubscribe();
  }, []);

  return (
    <aside className="w-64 bg-card border-r flex-col hidden md:flex">
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
