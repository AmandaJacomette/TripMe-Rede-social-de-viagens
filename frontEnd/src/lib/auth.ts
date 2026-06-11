import { useEffect, useState } from "react";

export type User = { 
  id: string; 
  name: string; 
  username?: string;
  email: string; 
  avatar?: string; 
  profile_pic?: string;
  handle?: string 
};
const TOKEN_KEY = "tripme.token";
const USER_KEY = "tripme.user";
const EVT = "tripme:auth";

export const auth = {
  getToken: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },
  setSession: (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(EVT));
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event(EVT));
  },
  isAuthenticated: () => !!(typeof window !== "undefined" && localStorage.getItem(TOKEN_KEY)),
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => auth.getUser());
  useEffect(() => {
    const on = () => setUser(auth.getUser());
    window.addEventListener(EVT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return { user, isAuthenticated: !!user, logout: auth.logout };
}
