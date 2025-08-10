
"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Fallback if username is not in session storage for some reason
      setUsername("Admin");
    }
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
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
        </Header>
        <main className="flex-1 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
