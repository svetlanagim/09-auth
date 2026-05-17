"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";

const PRIVATE_ROUTES = ["/profile", "/notes"];

const isPrivateRoute = (pathname: string) =>
  PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      setIsChecking(true);
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (isPrivateRoute(pathname)) {
            await logout();
            router.push("/sign-in");
          }
        }
      } catch {
        clearIsAuthenticated();
        if (isPrivateRoute(pathname)) {
          router.push("/sign-in");
        }
      } finally {
        setIsChecking(false);
      }
    };

    verify();
  }, [pathname, clearIsAuthenticated, router, setUser]);

  if (isChecking) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  }

  if (!isAuthenticated && isPrivateRoute(pathname)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
