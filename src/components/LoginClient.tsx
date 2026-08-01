"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "@/components/AuthModal";
import { Logo } from "@/components/ui/logo";
import { Shield, Sparkles, ArrowRight } from "lucide-react";

export default function LoginClient() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
            نوبت رو
          </h1>
          <p className="text-slate-400">ورود به پلتفرم مدیریت نوبت‌دهی</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setAuthOpen(true)}
            className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 text-right"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-200">ورود / ثبت‌نام</h3>
                <p className="text-sm text-slate-400">برای کاربران و ارائه‌دهندگان</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>

          <button
            onClick={() => setAuthOpen(true)}
            className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all duration-300 text-right"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-200">ورود مدیر</h3>
                <p className="text-sm text-slate-400">دسترسی به پنل مدیریت</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            با ورود شما با قوانین و شرایط استفاده از سرویس موافقت می‌کنید.
          </p>
        </div>
      </motion.div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(role) => {
          if (role === "ADMIN") {
            window.location.href = "/admin/users";
          }
        }}
      />
    </>
  );
}
