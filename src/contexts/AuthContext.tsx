"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BusinessSession {
  slug: string;
  businessName: string;
  email: string;
}

interface AuthContextType {
  session: BusinessSession | null;
  login: (slug: string, businessName: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<BusinessSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("business_session");
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem("business_session");
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (slug: string, businessName: string, email: string) => {
    const newSession = { slug, businessName, email };
    setSession(newSession);
    localStorage.setItem("business_session", JSON.stringify(newSession));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("business_session");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0d0e15] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, login, logout, isAuthenticated: !!session }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
