
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  
  React.useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/login");
    } else {
      const userRole = sessionStorage.getItem("userRole");
      if (userRole === 'Administrator') {
        router.push("/admin/dashboard");
      } else {
        router.push("/transactions");
      }
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

  return null;
}
