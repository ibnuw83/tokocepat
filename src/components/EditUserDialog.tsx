
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from '@/lib/types';


export function EditUserDialog({ isOpen, onClose, onSave, user, existingUsers }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: User) => void;
  user: User;
  existingUsers: User[];
}) {

  const formSchema = z.object({
    username: z.string().min(3, { message: "Username minimal 3 karakter." }).refine(
      (value) => !existingUsers.some(u => u.username === value && u.id !== user.id),
      { message: "Username ini sudah digunakan." }
    ),
    password: z.string().min(6, { message: "Password minimal 6 karakter." }).or(z.literal("")).optional(),
    role: z.enum(['Administrator', 'Kasir'], { required_error: "Peran harus dipilih." }),
    status: z.enum(['active', 'inactive'])
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      password: "",
      role: user.role,
      status: user.status,
    },
  });

  React.useEffect(() => {
    if (user && isOpen) {
      form.reset({
        username: user.username,
        password: "",
        role: user.role,
        status: user.status
      });
    }
  }, [user, isOpen, form]);

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const updatedUser = {
      ...user,
      username: values.username,
      role: values.role,
      status: values.status,
      // Only update password if a new one is provided
      password: values.password ? values.password : user.password,
    }
    onSave(updatedUser);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>Perbarui detail untuk pengguna "{user.username}".</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="cth: kasir_baru" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password Baru (Opsional)</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Kosongkan jika tidak diubah" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Peran</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={user.username === 'admin'}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih peran pengguna" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Kasir">Kasir</SelectItem>
                                        <SelectItem value="Administrator">Administrator</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={user.username === 'admin'}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
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
