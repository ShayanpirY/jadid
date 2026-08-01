"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        login(data.provider.slug, data.provider.businessName, data.provider.email);
        if (onClose) onClose();
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "نام کاربری یا رمز عبور اشتباه است");
      }
    } catch (err) {
      console.error("Login submit error:", err);
      setError("خطا در ارتباط با سرور. لطفاً کنسول را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">ورود به داشبورد</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              نام کاربری
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
              placeholder="نام کاربری خود را وارد کنید"
              dir="ltr"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              رمز عبور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
              placeholder="••••••••"
              dir="ltr"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-fuchsia-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-fuchsia-600/20 text-sm"
          >
            {loading ? "در حال ورود..." : "ورود به داشبورد کسب‌وکار"}
          </button>
        </form>
      </div>
    </div>
  );
}
