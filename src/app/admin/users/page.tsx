
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  username: string;
  role: string;
  status: 'Aktif' | 'Nonaktif';
};

// Mock data for users
const initialUsers: User[] = [
  { id: "USR001", name: "Admin Utama", username: "admin", role: "Administrator", status: "Aktif" },
  { id: "USR002", name: "Kasir Pagi", username: "kasir01", role: "Kasir", status: "Aktif" },
  { id: "USR003", name: "Kasir Malam", username: "kasir02", role: "Kasir", status: "Nonaktif" },
];

export default function UsersPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [users, setUsers] = React.useState<User[]>(initialUsers);
    const router = useRouter();
    const { toast } = useToast();

    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.push("/login");
        } else {
            setIsMounted(true);
        }
    }, [router]);

    const handleToggleStatus = (userId: string) => {
        setUsers(prevUsers => {
            return prevUsers.map(user => {
                if (user.id === userId) {
                    const newStatus = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
                    toast({
                        title: "Status Pengguna Diperbarui",
                        description: `Pengguna ${user.name} sekarang ${newStatus}.`
                    })
                    return { ...user, status: newStatus };
                }
                return user;
            });
        });
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
    <AdminLayout>
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Manajemen Pengguna</CardTitle>
                    <CardDescription>Kelola akun pengguna dan kasir yang dapat mengakses aplikasi.</CardDescription>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Pengguna
                </Button>
            </div>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                            <Badge variant={user.status === 'Aktif' ? 'secondary' : 'destructive'}>
                                {user.status}
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
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                                        {user.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                        Hapus
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
  );
}
