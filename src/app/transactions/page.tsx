
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle, Trash2, Printer, X, FileText, ShoppingCart, LogOut, ScanBarcode, UserSearch } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Item, Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ReceiptDialog } from "@/components/ReceiptDialog";
import { AdminLayout } from "@/components/AdminLayout";
import { BarcodeScannerDialog } from "@/components/BarcodeScannerDialog";
import type { InventoryItem } from "@/app/admin/inventory/page";
import type { Customer } from "@/app/admin/customers/page";
import { ItemSearchComboBox } from "@/components/ItemSearchComboBox";
import { CustomerSearchComboBox } from "@/components/CustomerSearchComboBox";


const itemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama barang tidak boleh kosong"),
  price: z.coerce.number().min(0, "Harga harus positif"),
  costPrice: z.coerce.number().min(0),
  quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
});

export default function PosPage() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [discount, setDiscount] = React.useState(0);
  const [discountType, setDiscountType] = React.useState<"percentage" | "fixed">("fixed");
  const [isReceiptOpen, setReceiptOpen] = React.useState(false);
  const [isScannerOpen, setScannerOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      id: "",
      name: "",
      price: 0,
      costPrice: 0,
      quantity: 1,
    },
  });

  const loadData = React.useCallback(() => {
    const storedInventory = localStorage.getItem("inventoryItems");
    if (storedInventory) setInventory(JSON.parse(storedInventory));

    const storedCustomers = localStorage.getItem("customers");
    if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
  }, []);

  React.useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/login");
    } else {
      setIsMounted(true);
      loadData();
      
      // Listen to storage changes to keep data fresh
      window.addEventListener('storage', loadData);
      return () => window.removeEventListener('storage', loadData);
    }
  }, [router, loadData]);

  // Sync current cart with localStorage
  React.useEffect(() => {
    if (!isMounted) return;
     try {
        const storedItems = localStorage.getItem("pos-items");
        if (storedItems) setItems(JSON.parse(storedItems));
        const storedDiscount = localStorage.getItem("pos-discount");
        if (storedDiscount) setDiscount(JSON.parse(storedDiscount));
        const storedDiscountType = localStorage.getItem("pos-discount-type");
        if (storedDiscountType) setDiscountType(JSON.parse(storedDiscountType as "percentage" | "fixed"));
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
      }
  }, [isMounted]);

  React.useEffect(() => {
    if (isMounted) localStorage.setItem("pos-items", JSON.stringify(items));
  }, [items, isMounted]);

  React.useEffect(() => {
     if (isMounted) localStorage.setItem("pos-discount", JSON.stringify(discount));
  }, [discount, isMounted]);

  React.useEffect(() => {
     if (isMounted) localStorage.setItem("pos-discount-type", JSON.stringify(discountType));
  }, [discountType, isMounted]);


  const subtotal = React.useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const discountAmount = React.useMemo(() => {
    if (discountType === "percentage") {
      return subtotal * (discount / 100);
    }
    return discount;
  }, [subtotal, discount, discountType]);

  const total = React.useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  function handleAddItem(data: z.infer<typeof itemSchema>) {
    if (!data.id) {
        toast({
            variant: "destructive",
            title: "Barang Tidak Valid",
            description: "Silakan pilih barang dari daftar pencarian.",
        });
        return;
    }

    const inventoryItem = inventory.find(i => i.id === data.id);
    if (!inventoryItem) {
        toast({
            variant: "destructive",
            title: "Barang Tidak Ditemukan",
            description: "Barang ini tidak ada di inventaris.",
        });
        return;
    }
    
    const existingItem = items.find(item => item.id === data.id);
    const quantityInCart = existingItem ? existingItem.quantity : 0;
    const requestedQuantity = quantityInCart + data.quantity;

    if (requestedQuantity > inventoryItem.stock) {
        toast({
            variant: "destructive",
            title: "Stok Tidak Cukup",
            description: `Stok ${inventoryItem.name} hanya tersisa ${inventoryItem.stock}. Anda sudah punya ${quantityInCart} di keranjang.`,
        });
        return;
    }

    if (existingItem) {
        setItems(prev => prev.map(item => 
            item.id === existingItem.id 
            ? { ...item, quantity: item.quantity + data.quantity } 
            : item
        ));
         toast({
            title: "Jumlah Diperbarui",
            description: `Jumlah ${data.name} telah diperbarui di keranjang.`,
        });
    } else {
        const newItem: Item = {
            id: data.id,
            name: data.name,
            price: data.price,
            costPrice: data.costPrice,
            quantity: data.quantity,
        };
        setItems((prev) => [...prev, newItem]);
        toast({
            title: "Barang Ditambahkan",
            description: `${data.name} telah ditambahkan ke transaksi.`,
        });
    }
    form.reset({ id: "", name: "", price: 0, costPrice: 0, quantity: 1 });
  }

  function handleRemoveItem(id: string) {
    const removedItem = items.find(item => item.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));
     if (removedItem) {
      toast({
        title: "Barang Dihapus",
        description: `${removedItem.name} telah dihapus dari transaksi.`,
        variant: "destructive"
      });
    }
  }

  function handleUpdateQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      handleRemoveItem(id);
      return;
    }

    const inventoryItem = inventory.find(i => i.id === id);
    if (inventoryItem && quantity > inventoryItem.stock) {
        toast({
            variant: "destructive",
            title: "Stok Tidak Cukup",
            description: `Stok ${inventoryItem.name} hanya tersisa ${inventoryItem.stock}.`,
        });
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: inventoryItem.stock } : item));
        return;
    }

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }
  
  function handleNewTransaction() {
    setItems([]);
    setDiscount(0);
    setDiscountType("fixed");
    setSelectedCustomer(null);
    form.reset({ id: "", name: "", price: 0, quantity: 1 });
    localStorage.removeItem("pos-items");
    localStorage.removeItem("pos-discount");
    localStorage.removeItem("pos-discount-type");
    toast({
      title: "Transaksi Baru",
      description: "Keranjang dan pelanggan telah dikosongkan.",
    });
  }

  function finalizeTransaction() {
    // 1. Save transaction to history
    const storedTransactions = localStorage.getItem("transactions");
    const transactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];
    
    const newTransaction: Transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString(),
      items: items.reduce((sum, item) => sum + item.quantity, 0),
      total: total,
      operator: sessionStorage.getItem("username") || "Unknown",
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name || "Pelanggan Umum",
      details: items,
    };
    
    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    // 2. Update stock in inventory
    const updatedInventory = [...inventory];
    items.forEach(cartItem => {
        const itemIndex = updatedInventory.findIndex(invItem => invItem.id === cartItem.id);
        if (itemIndex > -1) {
            updatedInventory[itemIndex].stock -= cartItem.quantity;
        }
    });
    localStorage.setItem("inventoryItems", JSON.stringify(updatedInventory));
    
    // Trigger storage event to update other components
    window.dispatchEvent(new Event("storage"));

    // 3. Clear cart and UI for next transaction
    handleNewTransaction();
    setReceiptOpen(false); // Close receipt dialog
     toast({
        title: "Transaksi Selesai",
        description: "Stok telah diperbarui dan transaksi baru siap dimulai.",
    });
  }
  
  function handleBarcodeScanned(decodedText: string) {
    const foundItem = inventory.find(item => item.barcode === decodedText);
    if (foundItem) {
        handleItemSelect(foundItem);
        toast({
            title: "Barang Ditemukan",
            description: `${foundItem.name} ditambahkan. Silakan atur jumlah.`,
        });
    } else {
         toast({
            variant: "destructive",
            title: "Barang Tidak Ditemukan",
            description: `Barcode ${decodedText} tidak cocok dengan barang manapun.`,
        });
    }
    setScannerOpen(false);
  }

  const handleItemSelect = (item: InventoryItem) => {
    form.setValue("id", item.id);
    form.setValue("name", item.name);
    form.setValue("price", item.price);
    form.setValue("costPrice", item.costPrice);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
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
    <>
      <AdminLayout>
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-6 w-6 text-primary" />
                      <CardTitle className="font-headline">Transaksi Saat Ini</CardTitle>
                    </div>
                     <Button variant="outline" size="sm" onClick={handleNewTransaction} className="transition-transform active:scale-95">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Transaksi Baru
                    </Button>
                  </div>
                   <CardDescription className="pt-4">
                      <div className="flex items-center gap-3">
                        <UserSearch className="h-5 w-5 text-muted-foreground"/>
                        <CustomerSearchComboBox
                            customers={customers}
                            selectedCustomer={selectedCustomer}
                            onCustomerSelect={setSelectedCustomer}
                        />
                      </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-headline">Barang</TableHead>
                          <TableHead className="text-center font-headline">Jumlah</TableHead>
                          <TableHead className="text-right font-headline">Harga Satuan</TableHead>
                          <TableHead className="text-right font-headline">Total Harga</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.length > 0 ? (
                          items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="w-24">
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                                  className="w-20 text-center mx-auto"
                                  min="1"
                                />
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                              <TableCell className="text-center">
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-destructive transition-transform active:scale-95">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                              Belum ada barang di keranjang.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                       {items.length > 0 && (
                          <TableCaption>Daftar barang dalam transaksi saat ini.</TableCaption>
                       )}
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="font-headline flex items-center gap-3"><PlusCircle className="text-primary"/>Tambah Barang</CardTitle>
                        <Button variant="outline" onClick={() => setScannerOpen(true)}>
                            <ScanBarcode className="mr-2 h-4 w-4" />
                            Scan Barcode
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddItem)} className="grid md:grid-cols-4 gap-4 items-end">
                      <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cari Nama Barang</FormLabel>
                                <FormControl>
                                    <ItemSearchComboBox
                                        inventory={inventory}
                                        onItemSelect={handleItemSelect}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Harga</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Otomatis" {...field} readOnly/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="md:col-start-4 transition-transform active:scale-95">Tambah</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-3"><FileText className="text-primary"/>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="space-y-2">
                    <Label>Diskon</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="flex-grow"
                      />
                      <Select value={discountType} onValueChange={(value: "percentage" | "fixed") => setDiscountType(value)}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">IDR</SelectItem>
                          <SelectItem value="percentage">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Diskon</span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                  <hr/>
                  <div className="flex justify-between text-xl font-bold font-headline">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                   <Button size="lg" className="w-full transition-transform active:scale-95" onClick={() => setReceiptOpen(true)} disabled={items.length === 0}>
                    <Printer className="mr-2 h-5 w-5"/> Proses & Buat Struk
                   </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </AdminLayout>

      <ReceiptDialog
        isOpen={isReceiptOpen}
        onClose={() => setReceiptOpen(false)}
        customerName={selectedCustomer?.name || "Pelanggan Umum"}
        items={items}
        subtotal={subtotal}
        discountAmount={discountAmount}
        total={total}
        formatCurrency={formatCurrency}
        onConfirm={finalizeTransaction}
      />
      <BarcodeScannerDialog
        isOpen={isScannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleBarcodeScanned}
      />
    </>
  );
}
