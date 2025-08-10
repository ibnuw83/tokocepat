
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

interface FinancialsEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'capital' | 'expense';
  onSave: (description: string, amount: number) => void;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Deskripsi tidak boleh kosong." }),
  amount: z.coerce.number().min(1, { message: "Jumlah minimal 1." }),
});

export function FinancialsEntryDialog({ isOpen, onClose, type, onSave }: FinancialsEntryDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
    },
  });

  const dialogTitle = type === 'capital' ? 'Tambah Catatan Modal' : 'Tambah Catatan Pengeluaran';
  const dialogDescription = `Formulir untuk mencatat ${type === 'capital' ? 'pemasukan modal' : 'pengeluaran baru'}.`;

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSave(values.description, values.amount);
    toast({
        title: "Data Tersimpan",
        description: `Catatan baru telah berhasil ditambahkan.`,
    });
    form.reset();
    onClose();
  }

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        description: "",
        amount: 0,
      });
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                                <Textarea placeholder={type === 'capital' ? 'cth: Modal dari investor' : 'cth: Pembelian bahan baku'} {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jumlah (IDR)</FormLabel>
                            <FormControl>
                                <Input type="number" min="1" placeholder="cth: 500000" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="submit">Simpan</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
