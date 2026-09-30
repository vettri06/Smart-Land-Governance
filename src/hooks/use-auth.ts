import { useState, useCallback, useEffect } from "react";

export type UserRole = "citizen" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  village?: string;
  designation?: string;
}

// Demo credentials for the prototype
export const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  citizen: {
    password: "citizen123",
    user: {
      id: "USR001",
      name: "Ravi Kumar",
      email: "ravi@example.com",
      role: "citizen",
      avatar: "RK",
      phone: "9876543210",
      village: "Talikota",
    },
  },
  admin: {
    password: "admin123",
    user: {
      id: "ADM001",
      name: "Dr. Suresh Patel",
      email: "admin@suryaland.gov.in",
      role: "admin",
      avatar: "SP",
      phone: "9876500001",
      designation: "District Land Officer",
    },
  },
};

const STORAGE_KEY = "surya-auth";

function getStoredAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(getStoredAuth);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    setIsLoading(true);

    const entry = DEMO_USERS[username.toLowerCase().trim()];
    if (!entry) {
      setIsLoading(false);
      return { success: false, error: "Invalid username. Use 'citizen' or 'admin'." };
    }
    if (entry.password !== password) {
      setIsLoading(false);
      return { success: false, error: "Incorrect password. Check credentials below." };
    }

    setUser(entry.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user));
    setIsLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isAdmin = user?.role === "admin";
  const isCitizen = user?.role === "citizen";

  return { user, login, logout, isLoading, isAdmin, isCitizen, isAuthenticated: !!user };
}
