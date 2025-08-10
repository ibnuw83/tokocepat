
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


export default function SettingsPage() {
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
    
    const handleSave = () => {
        toast({
            title: "Pengaturan Disimpan",
            description: "Perubahan pengaturan telah berhasil disimpan.",
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
  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Aplikasi</CardTitle>
            <CardDescription>Kelola pengaturan umum untuk aplikasi POS Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="store-name">Nama Toko</Label>
                <Input id="store-name" defaultValue="Toko Cepat" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="store-address">Alamat Toko</Label>
                <Input id="store-address" defaultValue="Jl. Jendral Sudirman No. 123" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Aktifkan Mode Gelap</Label>
                    <p className="text-xs text-muted-foreground">
                        Ubah tema aplikasi ke mode gelap.
                    </p>
                </div>
                <Switch />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Pajak Penjualan (PPN)</Label>
                     <p className="text-xs text-muted-foreground">
                        Aktifkan perhitungan pajak pada total transaksi.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="11" className="w-20" />
                    <span>%</span>
                    <Switch defaultChecked={true} />
                </div>
            </div>
            <Button onClick={handleSave}>Simpan Perubahan</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

