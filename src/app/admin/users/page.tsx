
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/types";
import { AddUserDialog } from "@/components/AddUserDialog";
import { EditUserDialog } from "@/components/EditUserDialog";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default function UsersPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
    const [isToggleStatusDialogOpen, setToggleStatusDialogOpen] = React.useState(false);
    const [userToToggle, setUserToToggle] = React.useState<User | null>(null);
    const [userToEdit, setUserToEdit] = React.useState<User | null>(null);
    const [users, setUsers] = React.useState<User[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        const userRole = sessionStorage.getItem("userRole");

        if (isLoggedIn !== "true" || userRole !== 'Administrator') {
            router.push("/login");
        } else {
            setIsMounted(true);
            const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
                const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setUsers(usersData);
            });
            return () => unsubscribe();
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
    
    const handleAddNewUser = async (values: Omit<User, 'id' | 'status'>) => {
        try {
            const newUser = { ...values, status: 'active' };
            await addDoc(collection(db, "users"), newUser);
            toast({
                title: "Pengguna Ditambahkan",
                description: `Pengguna ${values.username} telah berhasil dibuat.`
            })
        } catch (error) {
            console.error("Error adding user: ", error);
            toast({ variant: "destructive", title: "Gagal Menambahkan" });
        }
    };
    
    const handleEditUser = async (values: User) => {
        try {
            const userRef = doc(db, "users", values.id);
            const { id, ...dataToUpdate } = values;
            await updateDoc(userRef, dataToUpdate);
            toast({
                title: "Pengguna Diperbarui",
                description: `Data untuk ${values.username} telah diperbarui.`
            });
            setUserToEdit(null);
        } catch (error) {
            console.error("Error updating user: ", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui" });
        }
    }

    const handleOpenEditDialog = (user: User) => {
        setUserToEdit(user);
        setEditDialogOpen(true);
    }
    
    const handleOpenToggleStatusDialog = (user: User) => {
        if (user.username === 'admin') {
            toast({
                variant: "destructive",
                title: "Aksi Ditolak",
                description: "Pengguna 'admin' tidak dapat dinonaktifkan.",
            });
            return;
        }
        setUserToToggle(user);
        setToggleStatusDialogOpen(true);
    }

    const handleConfirmToggleStatus = async () => {
        if (!userToToggle) return;
        try {
            const userRef = doc(db, "users", userToToggle.id);
            const newStatus = userToToggle.status === 'active' ? 'inactive' : 'active';
            await updateDoc(userRef, { status: newStatus });
            toast({
                title: "Status Pengguna Diperbarui",
                description: `Pengguna "${userToToggle.username}" telah di${newStatus === 'active' ? 'aktifkan' : 'nonaktifkan'}.`,
            });
        } catch (error) {
            console.error("Error toggling user status: ", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui Status" });
        } finally {
            setToggleStatusDialogOpen(false);
            setUserToToggle(null);
        }
    }
    
  return (
    <>
    <AdminLayout>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Manajemen Pengguna</CardTitle>
                    <CardDescription>Kelola akun yang dapat mengakses aplikasi POS Anda.</CardDescription>
                </div>
                <Button onClick={() => setAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Pengguna
                </Button>
            </div>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>
                            <Badge variant={user.role === 'Administrator' ? 'default' : 'secondary'}>
                                {user.role}
                            </Badge>
                        </TableCell>
                         <TableCell>
                            <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} className={user.status === 'active' ? 'border-green-500 text-green-600' : ''}>
                                {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </Badge>
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
                                    <DropdownMenuItem onClick={() => handleOpenEditDialog(user)}>
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleOpenToggleStatusDialog(user)}
                                      className={user.status === 'active' ? "text-destructive focus:bg-destructive/10 focus:text-destructive" : "text-green-600 focus:bg-green-100 focus:text-green-700"}
                                      disabled={user.username === 'admin'}
                                    >
                                      {user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
    <AddUserDialog
        isOpen={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddNewUser}
        existingUsers={users}
    />
    {userToEdit && (
      <EditUserDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
              setEditDialogOpen(false);
              setUserToEdit(null);
          }}
          user={userToEdit}
          onSave={handleEditUser}
          existingUsers={users}
      />
    )}
    <AlertDialog open={isToggleStatusDialogOpen} onOpenChange={setToggleStatusDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                    Anda akan mengubah status pengguna 
                    <span className="font-bold"> "{userToToggle?.username}" </span>
                    menjadi <span className="font-bold">{userToToggle?.status === 'active' ? 'Nonaktif' : 'Aktif'}</span>.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setUserToToggle(null)}>Batal</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={handleConfirmToggleStatus}
                    className={userToToggle?.status === 'active' ? "bg-destructive hover:bg-destructive/90" : "bg-green-600 hover:bg-green-700 text-white"}
                >Ya, Lanjutkan</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
