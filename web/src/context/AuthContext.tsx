"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    // Khởi tạo state từ localStorage ngay từ đầu (chỉ chạy 1 lần)
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  });
  const router = useRouter();

  const login = (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    router.push("/"); // Chuyển hướng về trang chủ
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
