
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Box, LogIn } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const loginSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = React.useState(false);
  const [storeName, setStoreName] = React.useState("Toko Cepat");
  const [logo, setLogo] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsMounted(true);
    if (sessionStorage.getItem("isLoggedIn") === "true") {
      router.push("/");
    }

    const settingsQuery = query(collection(db, "settings"));
    const unsubscribe = onSnapshot(settingsQuery, (snapshot) => {
        if (!snapshot.empty) {
            const settingsData = snapshot.docs[0].data();
            setStoreName(settingsData.storeName || "Toko Cepat");
            setLogo(settingsData.logo || null);
        }
    });

    return () => unsubscribe();
  }, [router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", data.username), where("password", "==", data.password));
    
    try {
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: "Username atau password salah.",
        });
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data() as User;

      if (user.status === 'inactive') {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: "Akun Anda tidak aktif. Silakan hubungi administrator.",
        });
        return;
      }

      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("userRole", user.role);
      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${user.username}!`,
      });
      router.push("/");

    } catch (error) {
       console.error("Error during login: ", error);
       toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Tidak dapat terhubung ke server. Coba lagi nanti.",
      });
    }
  }

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            {logo ? (
              <Image src={logo} alt="Logo" width={40} height={40} className="object-contain" />
            ) : (
              <Box className="h-10 w-10 text-primary" />
            )}
          </div>
          <CardTitle className="text-3xl font-headline">{storeName}</CardTitle>
          <CardDescription>Silakan login untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-4 transition-transform active:scale-95">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
