
"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();

  function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    router.push("/login");
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari aplikasi.",
    });
  }
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header>
           <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </Header>
        <main className="flex-1 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
