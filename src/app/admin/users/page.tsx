
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
import { initialUsers } from "@/lib/users";


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

    const saveUsersToStorage = React.useCallback((items: User[]) => {
        localStorage.setItem("app-users", JSON.stringify(items));
        window.dispatchEvent(new Event('storage'));
    }, []);

    const loadDataFromStorage = React.useCallback(() => {
        const savedUsers = localStorage.getItem("app-users");
        if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
        } else {
            setUsers(initialUsers);
            saveUsersToStorage(initialUsers);
        }
    }, [saveUsersToStorage]);

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        const userRole = sessionStorage.getItem("userRole");

        if (isLoggedIn !== "true" || userRole !== 'Administrator') {
            router.push("/login");
        } else {
            setIsMounted(true);
            loadDataFromStorage();
            window.addEventListener('storage', loadDataFromStorage);
            return () => {
                window.removeEventListener('storage', loadDataFromStorage);
            };
        }
    }, [router, loadDataFromStorage]);
    
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
    
    const handleAddNewUser = (values: Omit<User, 'id' | 'status'>) => {
        const newUser: User = {
            id: `USER${Date.now()}`,
            status: "active",
            ...values
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);
        toast({
            title: "Pengguna Ditambahkan",
            description: `Pengguna ${values.username} telah berhasil dibuat.`
        })
    };
    
    const handleEditUser = (values: User) => {
        const updatedUsers = users.map(u => u.id === values.id ? values : u);
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);
        toast({
            title: "Pengguna Diperbarui",
            description: `Data untuk ${values.username} telah diperbarui.`
        });
        setUserToEdit(null);
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

    const handleConfirmToggleStatus = () => {
        if (!userToToggle) return;

        const updatedUsers = users.map(u => 
            u.id === userToToggle.id 
                ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
                : u
        );
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);

        toast({
            title: "Status Pengguna Diperbarui",
            description: `Pengguna "${userToToggle.username}" telah di${userToToggle.status === 'active' ? 'nonaktifkan' : 'aktifkan'}.`,
        });

        setToggleStatusDialogOpen(false);
        setUserToToggle(null);
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
                <AlertDialogAction onClick={handleConfirmToggleStatus}>Ya, Lanjutkan</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
