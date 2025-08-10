
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowUp, ArrowDown, TriangleAlert, MoreHorizontal, Search } from "lucide-react";
import { StockAdjustmentDialog } from "@/components/StockAdjustmentDialog";
import { AddItemDialog } from "@/components/AddItemDialog";
import { BarcodeScannerDialog } from "@/components/BarcodeScannerDialog";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { EditItemDialog } from "@/components/EditItemDialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


// Mock data for inventory
const initialInventoryItems = [
  { id: "ITEM001", barcode: "8992761134037", name: "Kopi Susu", stock: 50, costPrice: 12000, price: 18000, lowStockThreshold: 10 },
  { id: "ITEM002", barcode: "8999909090123", name: "Roti Coklat", stock: 8, costPrice: 7000, price: 10000, lowStockThreshold: 5 },
  { id: "ITEM003", barcode: "8991234567890", name: "Teh Manis", stock: 80, costPrice: 5000, price: 8000, lowStockThreshold: 20 },
  { id: "ITEM004", barcode: "8990987654321", name: "Donat Gula", stock: 42, costPrice: 4000, price: 7000, lowStockThreshold: 10 },
];

export type InventoryItem = typeof initialInventoryItems[0];

export default function InventoryPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isAdjustmentDialogOpen, setAdjustmentDialogOpen] = React.useState(false);
    const [isAddItemDialogOpen, setAddItemDialogOpen] = React.useState(false);
    const [isScannerOpen, setScannerOpen] = React.useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState<InventoryItem | null>(null);
    const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null);
    const [adjustmentType, setAdjustmentType] = React.useState<"in" | "out">("in");
    const [inventoryItems, setInventoryItems] = React.useState<InventoryItem[]>(initialInventoryItems);
    const [searchTerm, setSearchTerm] = React.useState("");
    const { toast } = useToast();
    const router = useRouter();

    // This ref will hold the function to update the form field in AddItemDialog
    const setBarcodeInDialogRef = React.useRef<(barcode: string) => void>(() => {});

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

    const filteredItems = inventoryItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }

    const handleOpenAdjustmentDialog = (type: "in" | "out") => {
        setAdjustmentType(type);
        setAdjustmentDialogOpen(true);
    }

    const handleStockAdjustment = (itemId: string, quantity: number, notes: string) => {
        setInventoryItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === itemId) {
                    const newStock = adjustmentType === 'in' ? item.stock + quantity : item.stock - quantity;
                    return { ...item, stock: newStock < 0 ? 0 : newStock };
                }
                return item;
            });
        });
    }

    const handleAddNewItem = (values: { barcode: string; name: string; costPrice: number; price: number; stock: number; lowStockThreshold: number }) => {
        const newItem: InventoryItem = {
            id: `ITEM${Date.now()}`,
            ...values
        };
        setInventoryItems(prev => [...prev, newItem]);
    };
    
    const handleEditItem = (item: InventoryItem) => {
        setEditingItem(item);
        setEditDialogOpen(true);
    };
    
    const handleOpenDeleteDialog = (item: InventoryItem) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteItem = () => {
        if (!itemToDelete) return;
        setInventoryItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
        toast({
            variant: "destructive",
            title: "Barang Dihapus",
            description: `Barang "${itemToDelete.name}" telah berhasil dihapus.`,
        });
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };


    const handleUpdateItem = (updatedItem: InventoryItem) => {
        setInventoryItems(prevItems => 
            prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
        );
        setEditingItem(null);
    };


    function handleBarcodeScanned(decodedText: string) {
        toast({
            title: "Barcode Terdeteksi",
            description: `Kode: ${decodedText}.`,
        });
        if (setBarcodeInDialogRef.current) {
            setBarcodeInDialogRef.current(decodedText);
        }
        setScannerOpen(false);
    }

  return (
    <>
        <AdminLayout>
        <div className="p-4 md:p-8">
            <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle>Manajemen Stok</CardTitle>
                        <CardDescription>Lihat dan kelola stok barang di toko Anda.</CardDescription>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" onClick={() => handleOpenAdjustmentDialog('in')}>
                            <ArrowUp className="mr-2 h-4 w-4" />
                            Barang Masuk
                        </Button>
                        <Button variant="outline" onClick={() => handleOpenAdjustmentDialog('out')}>
                            <ArrowDown className="mr-2 h-4 w-4" />
                            Barang Keluar
                        </Button>
                        <Button onClick={() => setAddItemDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Barang Baru
                        </Button>
                    </div>
                </div>
                 <div className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama barang..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm pl-9"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nama Barang</TableHead>
                        <TableHead>Kode Barcode</TableHead>
                        <TableHead>Harga Pokok</TableHead>
                        <TableHead>Harga Jual</TableHead>
                        <TableHead className="text-center">Jumlah Stok</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.barcode}</TableCell>
                            <TableCell>{formatCurrency(item.costPrice)}</TableCell>
                            <TableCell>{formatCurrency(item.price)}</TableCell>
                            <TableCell className="text-center font-semibold">
                                <div className="flex items-center justify-center gap-2">
                                     {item.stock <= item.lowStockThreshold && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                     <TriangleAlert className="h-4 w-4 text-destructive" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Stok hampir habis!</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                    <span>{item.stock}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Buka menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleOpenDeleteDialog(item)}
                                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                        >
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>Total {filteredItems.length} dari {inventoryItems.length} jenis barang ditemukan.</TableCaption>
                </Table>
            </CardContent>
            </Card>
        </div>
        </AdminLayout>
        <StockAdjustmentDialog
            isOpen={isAdjustmentDialogOpen}
            onClose={() => setAdjustmentDialogOpen(false)}
            type={adjustmentType}
            items={inventoryItems}
            onSave={handleStockAdjustment}
        />
        <AddItemDialog
            isOpen={isAddItemDialogOpen}
            onClose={() => setAddItemDialogOpen(false)}
            onSave={handleAddNewItem}
            onOpenScanner={() => setScannerOpen(true)}
            setBarcodeSetter={(setter) => { setBarcodeInDialogRef.current = setter; }}
        />
        {editingItem && (
            <EditItemDialog
                isOpen={isEditDialogOpen}
                onClose={() => {
                    setEditDialogOpen(false);
                    setEditingItem(null);
                }}
                item={editingItem}
                onSave={handleUpdateItem}
            />
        )}
        <BarcodeScannerDialog
            isOpen={isScannerOpen}
            onClose={() => setScannerOpen(false)}
            onScanSuccess={handleBarcodeScanned}
        />
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus barang
                        <span className="font-bold"> "{itemToDelete?.name}" </span>
                        secara permanen dari daftar inventaris Anda.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setItemToDelete(null)}>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteItem}>Ya, Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

    
