
"use client";

import * as React from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { LogOut, Box } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function CashierLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = React.useState<string | null>(null);
  const [storeName, setStoreName] = React.useState("Toko Cepat");
  const [logo, setLogo] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername("Kasir");
    }

    const savedName = localStorage.getItem("storeName");
    const savedLogo = localStorage.getItem("storeLogo");
    if (savedName) setStoreName(savedName);
    if (savedLogo) setLogo(savedLogo);
  }, []);

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
    <div className="flex min-h-screen flex-col">
        <Header>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                    {logo ? (
                        <Image src={logo} alt="Logo" width={24} height={24} className="object-contain" />
                        ) : (
                        <Box className="h-6 w-6 text-primary-foreground" />
                        )}
                    </div>
                    <h1 className="text-xl font-headline font-bold text-foreground hidden sm:block">
                    {storeName}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {username && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground hidden sm:inline">Login sebagai:</span>
                        <Badge variant="outline" className="text-base font-medium">{username}</Badge>
                    </div>
                    )}
                    <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                    </Button>
                </div>
            </div>
        </Header>
      <main className="flex-1 bg-muted/30">
        {children}
      </main>
    </div>
  );
}

    