"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";
import Link from "next/link";

const AuthNavigation = () => {
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.push("/sign-in");
  };

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>
          <button className={css.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
};

export default AuthNavigation;
