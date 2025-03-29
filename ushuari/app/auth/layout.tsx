// app/auth/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();

      // If already authenticated, redirect to appropriate dashboard
      if (isAuth && user) {
        switch (user.role) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "organization":
            router.push("/organization/dashboard");
            break;
          case "user":
          default:
            router.push("/dashboard");
            break;
        }
      }

      setIsLoading(false);
    };

    init();
  }, [checkAuth, router, user, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
