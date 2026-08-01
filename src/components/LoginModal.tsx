"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.trim() === "shayan" && password.trim() === "12345") {
      login("dr-shayan-piriai", "دکتر شایان پیریایی", "shayan@example.com");
      if (onClose) onClose();
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } else {
      setError("نام کاربری یا رمز عبور اشتباه است.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-white">
          ✕
        </button>

        <h2 className="text-xl font-bold text-center text-white mb-6">ورود مدیریت کسب‌وکار</h2>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">نام کاربری *</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:outline-none"
              dir="ltr"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">رمز عبور *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:outline-none"
              dir="ltr"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-fuchsia-600/20 text-sm mt-2"
          >
            ورود به داشبورد کسب‌وکار
          </button>
        </form>

      </div>
    </div>
  );
}
