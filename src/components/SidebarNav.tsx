"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { allMenuItems, cashierMenuItems } from "@/lib/menuItems";

export function SidebarNav() {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = React.useState(allMenuItems);

  React.useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole === 'Kasir') {
        setMenuItems(cashierMenuItems);
    } else {
        setMenuItems(allMenuItems);
    }
  }, []);

  return (
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
  );
}
