
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

interface AddCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama pelanggan tidak boleh kosong." }),
  phone: z.string().min(10, { message: "Nomor telepon minimal 10 digit." }),
});

export function AddCustomerDialog({ isOpen, onClose, onSave }: AddCustomerDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    form.reset();
    onClose();
  }

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        phone: "",
      });
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
          <DialogDescription>Masukkan detail pelanggan baru untuk disimpan.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                                <Input placeholder="cth: Budi Santoso" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="cth: 081234567890" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="submit">Simpan Pelanggan</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
