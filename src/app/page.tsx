"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, LogOut } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/login");
    } else {
      setIsMounted(true);
    }
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    router.push("/login");
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari aplikasi.",
    });
  }

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Memuat...</span>
        </div>
      </div>
    );
  }
  
  const menuItems = [
    { href: "/transactions", icon: CreditCard, label: "Kasir" },
    { href: "/admin/users", icon: Users, label: "Manajemen Pengguna" },
  ];

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold font-headline mb-6">Dashboard Admin</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
             <Link href={item.href} key={item.href}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Kelola</div>
                  <p className="text-xs text-muted-foreground">
                    Buka halaman {item.label.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
