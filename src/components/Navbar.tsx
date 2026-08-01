"use client";

import { useState } from "react";
import DashboardLoginModal from "@/components/DashboardLoginModal";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 py-3 bg-[#0d0e15]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            نوبت رو
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href="#features" className="hidden sm:inline-flex text-sm text-slate-400 hover:text-white transition-colors">
            ویژگی‌ها
          </a>
          <a href="#pricing" className="hidden sm:inline-flex text-sm text-slate-400 hover:text-white transition-colors">
            اشتراک
          </a>
          <a href="#testimonials" className="hidden sm:inline-flex text-sm text-slate-400 hover:text-white transition-colors">
            نظرات
          </a>
          <a href="/demo" className="hidden sm:inline-flex text-sm text-slate-400 hover:text-white transition-colors">
            دموی نوبت‌گیری
          </a>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg transition-all shadow-lg shadow-fuchsia-600/20"
          >
            ورود به داشبورد
          </button>
        </div>
      </nav>

      <DashboardLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
