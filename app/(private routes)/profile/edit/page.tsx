"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { User } from "@/types/user";
import css from "./EditProfilePage.module.css";
import useAuthStore from "@/lib/store/authStore";

export default function EditProfilePage() {
  const [user, setLocalUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      const data = await getMe();
      setLocalUser(data);
      setUsername(data.username);
    };
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedUser = await updateMe({ username });
    setUser(updatedUser);
    router.push("/profile");
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <p>Email: {user.email}</p>
          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
