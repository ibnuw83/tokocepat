
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, UploadCloud, PlusCircle, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


export type Categories = Record<string, string[]>;

const defaultCategories: Categories = {
    "Fashion": ["Pakaian Pria", "Pakaian Wanita", "Sepatu", "Aksesoris", "Perhiasan"],
    "Elektronik": ["Smartphone & Aksesoris", "Laptop & Komputer", "Kamera", "Audio & Speaker", "Peralatan Rumah Tangga Elektronik"],
    "Kecantikan & Perawatan": ["Makeup", "Perawatan Kulit", "Parfum", "Perawatan Rambut", "Produk Kesehatan"],
    "Rumah & Dekorasi": ["Perabotan Rumah", "Dekorasi Interior", "Peralatan Dapur", "Lampu & Pencahayaan", "Tanaman Hias"],
    "Olahraga & Outdoor": ["Pakaian & Sepatu Olahraga", "Alat Fitness", "Peralatan Camping", "Sepeda & Aksesoris", "Produk Hiking"],
    "Anak & Bayi": ["Pakaian Anak", "Mainan", "Perlengkapan Bayi", "Buku Anak", "Makanan & Susu Bayi"],
    "Makanan & Minuman": ["Makanan Ringan", "Minuman Kemasan", "Bahan Masakan", "Produk Organik", "Kue & Roti", "Kopi", "Teh"],
    "Buku & Stationery": ["Buku Fiksi & Nonfiksi", "Buku Pelajaran", "Alat Tulis", "Planner & Kalender", "Aksesoris Kantor"],
    "Otomotif": ["Sparepart", "Aksesoris Mobil & Motor", "Helm & Perlengkapan Safety", "Oli & Pelumas", "Alat Perawatan Kendaraan"],
    "Hobi & Koleksi": ["Alat Musik", "Koleksi Action Figure", "Alat Seni & Kerajinan", "Produk Gaming", "Kamera & Fotografi"],
};


export default function SettingsPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [storeName, setStoreName] = React.useState("Toko Cepat");
    const [storeAddress, setStoreAddress] = React.useState("Jl. Jendral Sudirman No. 123, Jakarta");
    const [logo, setLogo] = React.useState<string | null>(null);
    const [categories, setCategories] = React.useState<Categories>(defaultCategories);
    const [newCategory, setNewCategory] = React.useState("");
    const [newSubcategory, setNewSubcategory] = React.useState<{ [key: string]: string }>({});

    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.push("/login");
        } else {
            setIsMounted(true);
            // Load saved settings from localStorage
            const savedName = localStorage.getItem("storeName");
            const savedAddress = localStorage.getItem("storeAddress");
            const savedLogo = localStorage.getItem("storeLogo");
            const savedCategories = localStorage.getItem("storeCategories");

            if (savedName) setStoreName(savedName);
            if (savedAddress) setStoreAddress(savedAddress);
            if (savedLogo) setLogo(savedLogo);
            if (savedCategories) {
                setCategories(JSON.parse(savedCategories));
            } else {
                // If no categories are saved, save the default ones
                 localStorage.setItem("storeCategories", JSON.stringify(defaultCategories));
            }
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSaveChanges = () => {
        try {
            localStorage.setItem("storeName", storeName);
            localStorage.setItem("storeAddress", storeAddress);
            if (logo) {
                localStorage.setItem("storeLogo", logo);
            }
            localStorage.setItem("storeCategories", JSON.stringify(categories));
             // Dispatch a storage event to notify other components like Sidebar
            window.dispatchEvent(new Event('storage'));
            toast({
                title: "Pengaturan Disimpan",
                description: "Perubahan pada informasi toko telah berhasil disimpan.",
            });
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
            toast({
                variant: "destructive",
                title: "Gagal Menyimpan",
                description: "Terjadi kesalahan saat menyimpan pengaturan.",
            });
        }
    }

    const handleBackup = () => {
        try {
            const dataToBackup: { [key: string]: any } = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    dataToBackup[key] = localStorage.getItem(key);
                }
            }

            const jsonString = JSON.stringify(dataToBackup, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `toko-cepat-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({
                title: "Backup Berhasil",
                description: "Data aplikasi telah berhasil diunduh.",
            });
        } catch (error) {
             console.error("Failed to backup data", error);
            toast({
                variant: "destructive",
                title: "Gagal Backup",
                description: "Terjadi kesalahan saat membuat file cadangan.",
            });
        }
    }

    const handleRestoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File tidak valid.");
                }
                const data = JSON.parse(text);
                
                // Clear existing local storage before restoring
                // Be careful with this in a real app, maybe merge instead
                // localStorage.clear();

                for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        localStorage.setItem(key, data[key]);
                    }
                }
                 // Dispatch a storage event to notify other components
                window.dispatchEvent(new Event('storage'));

                toast({
                    title: "Pemulihan Berhasil",
                    description: "Data telah dipulihkan. Muat ulang halaman untuk melihat perubahan.",
                });

                // Reload to apply changes everywhere
                setTimeout(() => window.location.reload(), 1500);

            } catch (error) {
                console.error("Failed to restore data", error);
                toast({
                    variant: "destructive",
                    title: "Gagal Memulihkan Data",
                    description: "File cadangan tidak valid atau rusak.",
                });
            }
        };

        reader.readAsText(file);
    }

     const handleAddCategory = () => {
        if (newCategory && !categories[newCategory]) {
            const updatedCategories = { ...categories, [newCategory]: [] };
            setCategories(updatedCategories);
            setNewCategory("");
            toast({ title: "Kategori Ditambahkan", description: `"${newCategory}" telah ditambahkan.` });
        } else if (categories[newCategory]) {
            toast({ variant: "destructive", title: "Gagal", description: "Kategori tersebut sudah ada." });
        }
    };

    const handleAddSubcategory = (category: string) => {
        const subcatValue = newSubcategory[category]?.trim();
        if (subcatValue && !categories[category].includes(subcatValue)) {
            const updatedCategories = {
                ...categories,
                [category]: [...categories[category], subcatValue]
            };
            setCategories(updatedCategories);
            setNewSubcategory(prev => ({ ...prev, [category]: "" }));
            toast({ title: "Subkategori Ditambahkan" });
        }
    };

    const handleDeleteCategory = (categoryToDelete: string) => {
        const { [categoryToDelete]: _, ...remainingCategories } = categories;
        setCategories(remainingCategories);
        toast({ variant: "destructive", title: "Kategori Dihapus", description: `"${categoryToDelete}" telah dihapus.` });
    };

    const handleDeleteSubcategory = (category: string, subcategoryToDelete: string) => {
        const updatedSubcategories = categories[category].filter(sc => sc !== subcategoryToDelete);
        const updatedCategories = {
            ...categories,
            [category]: updatedSubcategories
        };
        setCategories(updatedCategories);
        toast({ variant: "destructive", title: "Subkategori Dihapus" });
    };

    
  return (
    <AdminLayout>
      <div className="p-4 md:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Toko</CardTitle>
            <CardDescription>Atur informasi dasar dan tampilan untuk toko Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="store-name">Nama Toko</Label>
                <Input id="store-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="store-address">Alamat Toko</Label>
                <Textarea id="store-address" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label>Logo Toko</Label>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-md border flex items-center justify-center bg-muted overflow-hidden">
                       {logo ? (
                            <Image src={logo} alt="Logo Preview" width={96} height={96} className="object-contain" />
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
            <Button onClick={handleSaveChanges}>Simpan Perubahan Toko</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manajemen Kategori</CardTitle>
            <CardDescription>Kelola kategori dan subkategori barang untuk inventaris Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <Label htmlFor="new-category">Tambah Kategori Baru</Label>
                <div className="flex gap-2 mt-2">
                    <Input 
                        id="new-category" 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="cth: Makanan Berat"
                    />
                    <Button onClick={handleAddCategory}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Tambah Kategori
                    </Button>
                </div>
            </div>
            
            <Accordion type="multiple" className="w-full">
                 {Object.entries(categories).map(([category, subcategories]) => (
                    <AccordionItem value={category} key={category}>
                        <AccordionTrigger className="flex justify-between items-center w-full hover:no-underline">
                           <div className="flex items-center gap-2">
                                <span className="font-semibold">{category}</span>
                                <Badge variant="secondary">{subcategories.length} sub</Badge>
                           </div>
                             <AlertDialog>
                                <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Yakin Ingin Menghapus Kategori?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tindakan ini akan menghapus kategori "{category}" beserta semua subkategorinya. Ini tidak akan mengubah kategori barang yang sudah ada.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteCategory(category)}>
                                        Ya, Hapus
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="pl-4 space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor={`new-sub-${category}`}>Tambah Subkategori</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id={`new-sub-${category}`}
                                            placeholder="Nama subkategori baru..."
                                            value={newSubcategory[category] || ""}
                                            onChange={(e) => setNewSubcategory(prev => ({ ...prev, [category]: e.target.value }))}
                                        />
                                        <Button size="sm" onClick={() => handleAddSubcategory(category)}>Tambah</Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {subcategories.length > 0 ? subcategories.map(sc => (
                                         <Badge key={sc} variant="outline" className="text-sm py-1 px-2 flex items-center gap-2">
                                            {sc}
                                            <button 
                                                className="rounded-full hover:bg-destructive/20 text-destructive"
                                                onClick={() => handleDeleteSubcategory(category, sc)}>
                                                <X className="h-3 w-3" />
                                            </button>
                                         </Badge>
                                    )) : <p className="text-xs text-muted-foreground">Belum ada subkategori.</p>}
                                </div>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                 ))}
            </Accordion>

          </CardContent>
           <CardFooter>
            <Button onClick={handleSaveChanges}>Simpan Perubahan Kategori</Button>
          </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Cadangkan & Pulihkan Data</CardTitle>
                <CardDescription>Simpan data aplikasi Anda atau pulihkan dari file cadangan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label className="block mb-2">Backup Data</Label>
                    <p className="text-sm text-muted-foreground pb-2">
                        Unduh semua data penting (stok, transaksi, pengguna, dll.) dalam satu file JSON.
                    </p>
                    <Button variant="outline" onClick={handleBackup}>
                        <Download className="mr-2 h-4 w-4" />
                        Unduh File Backup
                    </Button>
                </div>
                 <div>
                    <Label className="block mb-2">Pulihkan Data</Label>
                     <p className="text-sm text-muted-foreground pb-2">
                        Pilih file backup (.json) untuk mengembalikan data aplikasi Anda.
                    </p>
                    <Input 
                        id="restore" 
                        type="file" 
                        className="hidden" 
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleRestoreChange}
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Pilih File & Pulihkan
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    Penting: Proses pemulihan akan menimpa data yang ada saat ini. Pastikan Anda memilih file yang benar.
                </p>
            </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}
