"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from "@/lib/types";
import { getService, postService } from "@/lib/service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await getService<{ user: User }>("/user/profile");
      setUser(response.user);
    } catch {
      Cookies.remove("authToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { user, token, message } = await postService<{
        user: User;
        token: string;
        message: string;
      }>("/login", credentials);

      if (token) {
        Cookies.set("authToken", token, { expires: 7 });
        setUser(user);
      }

      return { success: true, message, user, token };
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Login failed",
      };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const { message } = await postService<{ message: string }>("/register", credentials);
      return { success: true, message };
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Registration failed",
      };
    }
  };

  const logout = () => {
    Cookies.remove("authToken");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
