
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

const loginSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

// Mock user data that would typically come from a database
const validUsers = [
  { username: "admin", password: "admin", role: "Administrator" },
  { username: "kasir01", password: "kasir01", role: "Kasir" },
  { username: "kasir02", password: "kasir02", role: "Kasir" },
];


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = React.useState(false);
  const [storeName, setStoreName] = React.useState("Toko Cepat");
  const [logo, setLogo] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsMounted(true);
    // If user is already logged in, redirect to home
    if (sessionStorage.getItem("isLoggedIn") === "true") {
      router.push("/");
    }
     // Load saved settings from localStorage
    const savedName = localStorage.getItem("storeName");
    const savedLogo = localStorage.getItem("storeLogo");
    if (savedName) setStoreName(savedName);
    if (savedLogo) setLogo(savedLogo);

  }, [router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    const user = validUsers.find(
        (u) => u.username === data.username && u.password === data.password
    );

    if (user) {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("userRole", user.role);
      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${user.username}!`,
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: "Username atau password salah.",
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
          <div className="flex justify-center items-center gap-3 mb-2">
             <div className="p-3 bg-primary rounded-lg inline-block">
                {logo ? (
                  <Image src={logo} alt="Logo" width={28} height={28} className="object-contain" />
                ) : (
                  <Box className="h-7 w-7 text-primary-foreground" />
                )}
             </div>
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
