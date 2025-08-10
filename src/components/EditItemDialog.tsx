
"use client";

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import type { InventoryItem } from '@/app/admin/inventory/page';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Categories } from '@/app/admin/settings/page';

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
  onSave: (values: InventoryItem) => void;
}

const formSchema = z.object({
  barcode: z.string().min(1, { message: "Kode barang tidak boleh kosong." }),
  name: z.string().min(1, { message: "Nama barang tidak boleh kosong." }),
  category: z.string().min(1, { message: "Kategori harus dipilih." }),
  subcategory: z.string().min(1, { message: "Subkategori harus dipilih." }),
  costPrice: z.coerce.number().min(0, { message: "Harga harus angka positif." }),
  price: z.coerce.number().min(0, { message: "Harga harus angka positif." }),
  stock: z.coerce.number().min(0, { message: "Stok harus angka positif." }),
  lowStockThreshold: z.coerce.number().min(0, { message: "Batas stok harus angka positif." }),
});

export function EditItemDialog({ isOpen, onClose, item, onSave }: EditItemDialogProps) {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<Categories>({});
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: item,
  });

  const selectedCategory = form.watch("category");

  // Load categories from localStorage when the dialog is open
  React.useEffect(() => {
    if (isOpen) {
      const savedCategories = localStorage.getItem("storeCategories");
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (item) {
      form.reset(item);
    }
  }, [item, form]);

  // Reset subcategory when category changes, if the old subcategory is not in the new list
  React.useEffect(() => {
    if (selectedCategory && item.category !== selectedCategory) {
        form.setValue("subcategory", "");
    }
  }, [selectedCategory, item.category, form]);


  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSave({ ...item, ...values });
    toast({
        title: "Barang Diperbarui",
        description: `Perubahan pada ${values.name} telah berhasil disimpan.`,
    });
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Data Barang</DialogTitle>
          <DialogDescription>Perbarui detail untuk barang yang sudah ada di inventaris.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                 <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kode Barang (Barcode)</FormLabel>
                            <FormControl>
                                <Input placeholder="Pindai atau masukkan kode..." {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Barang</FormLabel>
                            <FormControl>
                                <Input placeholder="cth: Kopi Americano" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                 <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.keys(categories).map(cat => (
                                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subkategori</FormLabel>
                                 <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih subkategori" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {selectedCategory && categories[selectedCategory]?.map(subcat => (
                                          <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="costPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Harga Awal (Modal)</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" placeholder="cth: 15000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Harga Jual</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" placeholder="cth: 22000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stok Saat Ini</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" placeholder="cth: 100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="lowStockThreshold"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Batas Stok Rendah</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" placeholder="cth: 10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="submit">Simpan Perubahan</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
