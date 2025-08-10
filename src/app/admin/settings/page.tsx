
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.push("/login");
        } else {
            setIsMounted(true);
        }
    }, [router]);
    
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

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setLogoPreview(URL.createObjectURL(file));
        }
    }
    
  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Toko</CardTitle>
            <CardDescription>Atur informasi dasar dan tampilan untuk toko Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="store-name">Nama Toko</Label>
                <Input id="store-name" defaultValue="Toko Cepat" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="store-address">Alamat Toko</Label>
                <Textarea id="store-address" defaultValue="Jl. Jendral Sudirman No. 123, Jakarta" />
            </div>
             <div className="space-y-2">
                <Label>Logo Toko</Label>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-md border flex items-center justify-center bg-muted overflow-hidden">
                       {logoPreview ? (
                            <Image src={logoPreview} alt="Logo Preview" width={96} height={96} className="object-contain" />
                        ) : (
                            <span className="text-xs text-muted-foreground text-center">Pratinjau Logo</span>
                        )}
                    </div>
                     <Input id="picture" type="file" className="hidden" onChange={handleLogoChange} accept="image/*"/>
                    <Button variant="outline" asChild>
                        <label htmlFor="picture">
                            <Upload className="mr-2 h-4 w-4" />
                            Unggah Logo
                        </label>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">Rekomendasi ukuran: 200x200px. Format: JPG, PNG.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Simpan Perubahan</Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}
