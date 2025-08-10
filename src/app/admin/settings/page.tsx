
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    const [receiptFooter, setReceiptFooter] = React.useState("Terima kasih telah berbelanja!");
    const [receiptPaperSize, setReceiptPaperSize] = React.useState("80mm");
    const [logo, setLogo] = React.useState<string | null>(null);
    const [categories, setCategories] = React.useState<Categories>({});
    const [newCategory, setNewCategory] = React.useState("");
    const [newSubcategory, setNewSubcategory] = React.useState<{ [key: string]: string }>({});
    
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const loadSettings = React.useCallback(() => {
        const savedName = localStorage.getItem("storeName");
        const savedAddress = localStorage.getItem("storeAddress");
        const savedLogo = localStorage.getItem("storeLogo");
        const savedCategories = localStorage.getItem("storeCategories");
        const savedFooter = localStorage.getItem("receiptFooter");
        const savedPaperSize = localStorage.getItem("receiptPaperSize");
        
        if (savedName) setStoreName(savedName);
        if (savedAddress) setStoreAddress(savedAddress);
        if (savedLogo) setLogo(savedLogo);
        if (savedFooter) setReceiptFooter(savedFooter);
        if (savedPaperSize) setReceiptPaperSize(savedPaperSize);

        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        } else {
            localStorage.setItem("storeCategories", JSON.stringify(defaultCategories));
            setCategories(defaultCategories);
        }
    }, []);

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.push("/login");
        } else {
            setIsMounted(true);
            loadSettings();

            window.addEventListener('storage', loadSettings);
            return () => {
                window.removeEventListener('storage', loadSettings);
            };
        }
    }, [router, loadSettings]);

    // Save settings immediately on change
    const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStoreName(e.target.value);
        localStorage.setItem("storeName", e.target.value);
    };

    const handleStoreAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStoreAddress(e.target.value);
        localStorage.setItem("storeAddress", e.target.value);
    };

    const handleReceiptFooterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReceiptFooter(e.target.value);
        localStorage.setItem("receiptFooter", e.target.value);
    };
    
    const handlePaperSizeChange = (value: string) => {
        setReceiptPaperSize(value);
        localStorage.setItem("receiptPaperSize", value);
    }

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setLogo(result);
                localStorage.setItem("storeLogo", result);
                toast({ title: "Logo Diperbarui", description: "Logo toko telah berhasil diunggah." });
            };
            reader.readAsDataURL(file);
        }
    }

    const saveCategories = (updatedCategories: Categories) => {
        setCategories(updatedCategories);
        localStorage.setItem("storeCategories", JSON.stringify(updatedCategories));
    }

    const handleAddCategory = () => {
        if (newCategory && !categories[newCategory]) {
            const updatedCategories = { ...categories, [newCategory]: [] };
            saveCategories(updatedCategories);
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
            saveCategories(updatedCategories);
            setNewSubcategory(prev => ({ ...prev, [category]: "" }));
            toast({ title: "Subkategori Ditambahkan" });
        }
    };

    const handleDeleteCategory = (categoryToDelete: string) => {
        const { [categoryToDelete]: _, ...remainingCategories } = categories;
        saveCategories(remainingCategories);
        toast({ variant: "destructive", title: "Kategori Dihapus", description: `"${categoryToDelete}" telah dihapus.` });
    };

    const handleDeleteSubcategory = (category: string, subcategoryToDelete: string) => {
        const updatedSubcategories = categories[category].filter(sc => sc !== subcategoryToDelete);
        const updatedCategories = {
            ...categories,
            [category]: updatedSubcategories
        };
        saveCategories(updatedCategories);
        toast({ variant: "destructive", title: "Subkategori Dihapus" });
    };

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
      <div className="p-4 md:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Toko & Struk</CardTitle>
            <CardDescription>Atur informasi dasar, tampilan toko, dan struk belanja. Perubahan disimpan secara otomatis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="store-name">Nama Toko</Label>
                <Input id="store-name" value={storeName} onChange={handleStoreNameChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="store-address">Alamat Toko</Label>
                <Textarea id="store-address" value={storeAddress} onChange={handleStoreAddressChange} />
            </div>
             <div className="space-y-2">
                <Label>Logo Toko</Label>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-md flex items-center justify-center bg-muted overflow-hidden">
                       {logo ? (
                            <Image src={logo} alt="Logo Preview" width={96} height={96} className="object-contain" />
                        ) : (
                            <span className="text-xs text-muted-foreground text-center">Pratinjau Logo</span>
                        )}
                    </div>
                     <Input id="picture" type="file" className="hidden" ref={fileInputRef} onChange={handleLogoChange} accept="image/*"/>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Unggah Logo
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">Rekomendasi ukuran: 200x200px. Format: JPG, PNG.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="receipt-footer">Teks Catatan Kaki Struk</Label>
                <Textarea id="receipt-footer" value={receiptFooter} onChange={handleReceiptFooterChange} placeholder="cth: Terima kasih telah berbelanja! Barang yang sudah dibeli tidak dapat dikembalikan." />
            </div>
             <div className="space-y-2">
                <Label>Ukuran Kertas Struk</Label>
                <RadioGroup value={receiptPaperSize} onValueChange={handlePaperSizeChange} className="flex gap-4 pt-1">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="80mm" id="size-80mm" />
                        <Label htmlFor="size-80mm">80mm (Standar Minimarket)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="58mm" id="size-58mm" />
                        <Label htmlFor="size-58mm">58mm (Kecil/Portable)</Label>
                    </div>
                </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manajemen Kategori</CardTitle>
            <CardDescription>Kelola kategori dan subkategori barang untuk inventaris Anda. Perubahan disimpan secara otomatis.</CardDescription>
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
                        <div className="flex justify-between items-center w-full py-4 border-b">
                            <AccordionTrigger className="flex-grow p-0 hover:no-underline border-none">
                               <div className="flex items-center gap-2">
                                    <span className="font-semibold">{category}</span>
                                    <Badge variant="secondary">{Array.isArray(subcategories) ? subcategories.length : 0} sub</Badge>
                               </div>
                            </AccordionTrigger>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8 ml-2">
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
                        </div>
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
                                    {Array.isArray(subcategories) && subcategories.length > 0 ? subcategories.map(sc => (
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
        </Card>
      </div>
    </AdminLayout>
  );
}
