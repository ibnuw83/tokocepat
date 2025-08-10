"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Box, LogOut, Menu, Calculator } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LiveClock } from "./LiveClock";
import { Badge } from "./ui/badge";
import { allMenuItems, cashierMenuItems } from "@/lib/menuItems";
import { CalculatorDialog } from "./CalculatorDialog";

export function PosHeader() {
  const pathname = usePathname();
  const [storeName, setStoreName] = React.useState("Toko Cepat");
  const [logo, setLogo] = React.useState<string | null>(null);
  const [menuItems, setMenuItems] = React.useState(allMenuItems);
  const [username, setUsername] = React.useState<string | null>(null);
  const [isCalculatorOpen, setCalculatorOpen] = React.useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const loadSettings = React.useCallback(() => {
    const savedName = localStorage.getItem("storeName");
    const savedLogo = localStorage.getItem("storeLogo");
    if (savedName) setStoreName(savedName);
    if (savedLogo) setLogo(savedLogo);
  }, []);

  React.useEffect(() => {
    loadSettings();
    const userRole = sessionStorage.getItem("userRole");
    const storedUsername = sessionStorage.getItem("username");

    if (storedUsername) setUsername(storedUsername);

    if (userRole === 'Kasir') {
        setMenuItems(cashierMenuItems);
    } else {
        setMenuItems(allMenuItems);
    }

    window.addEventListener('storage', loadSettings);
    return () => window.removeEventListener('storage', loadSettings);
  }, [loadSettings]);

  function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userRole");
    router.push("/login");
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari aplikasi.",
    });
  }

  return (
    <>
    <header className="py-4 px-4 md:px-8 border-b bg-card h-[73px] flex items-center sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between gap-4">
            {/* Left Section - Logo and Name */}
            <div className="flex items-center gap-3">
                {logo ? (
                    <Image src={logo} alt="Logo" width={32} height={32} className="object-contain" />
                ) : (
                    <Box className="h-8 w-8 text-primary" />
                )}
                <h1 className="text-xl md:text-2xl font-headline font-bold text-foreground">
                    {storeName}
                </h1>
            </div>

            {/* Middle Section - Navigation */}
             <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Menu className="h-4 w-4 mr-2" />
                            Menu
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                    {menuItems.map((item) => (
                        <Link href={item.href} key={item.label}>
                            <DropdownMenuItem className={cn(pathname === item.href && "bg-muted")}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </DropdownMenuItem>
                        </Link>
                    ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="icon" onClick={() => setCalculatorOpen(true)}>
                    <Calculator className="h-4 w-4"/>
                    <span className="sr-only">Kalkulator</span>
                </Button>
            </div>

            {/* Right Section - Clock, User, Logout */}
            <div className="flex items-center gap-4">
                <LiveClock />
                {username && (
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden lg:inline">Login sebagai:</span>
                    <Badge variant="outline" className="text-base font-medium">{username}</Badge>
                </div>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm" className="hidden sm:flex">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    </header>
    <CalculatorDialog isOpen={isCalculatorOpen} onClose={() => setCalculatorOpen(false)} />
    </>
  );
}
