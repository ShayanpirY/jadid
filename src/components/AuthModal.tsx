"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { UserRoleBadge } from "@/components/UserRoleBadge";
import { X, Mail, Lock, Phone, User, Shield, Crown, ChevronLeft, Building2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type AuthTab = "user" | "business" | "admin";

const userSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  name: z.string().optional(),
  phone: z.string().optional(),
});

const businessSchema = z.object({
  username: z.string().min(1, "نام کاربری را وارد کنید"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

const adminSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

type UserFormData = z.infer<typeof userSchema>;
type BusinessFormData = z.infer<typeof businessSchema>;
type AdminFormData = z.infer<typeof adminSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (role: "BUSINESS_ADMIN" | "ADMIN" | "PROVIDER" | "CLIENT", redirectTo?: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>("user");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register: registerUser,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors },
    reset: resetUser,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const {
    register: registerBusiness,
    handleSubmit: handleBusinessSubmit,
    formState: { errors: businessErrors },
    reset: resetBusiness,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
  });

  const {
    register: registerAdmin,
    handleSubmit: handleAdminSubmit,
    formState: { errors: adminErrors },
    reset: resetAdmin,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

  const handleUserLogin = async (data: UserFormData) => {
    setIsLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    resetUser();
    onClose();
    onLoginSuccess?.("CLIENT");
  };

  const handleBusinessLogin = async (data: BusinessFormData) => {
    setIsLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1000));

    if (data.username === "shayan" && data.password === "12345") {
      setIsLoading(false);
      resetBusiness();
      onClose();
      onLoginSuccess?.("BUSINESS_ADMIN", "/dashboard");
    } else {
      setIsLoading(false);
      setError("نام کاربری یا رمز عبور اشتباه است");
    }
  };

  const handleAdminLogin = async (data: AdminFormData) => {
    setIsLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1000));

    if (data.email === "pir0918021@gmail.com" && data.password === "Shayan021") {
      setIsLoading(false);
      resetAdmin();
      onClose();
      onLoginSuccess?.("ADMIN", "/admin/dashboard");
    } else {
      setIsLoading(false);
      setError("ایمیل یا رمز عبور اشتباه است");
    }
  };

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setError("");
    resetUser();
    resetBusiness();
    resetAdmin();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md"
          >
            <GlassCard className="p-6 sm:p-8 glow">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              {/* Tab Switcher */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => switchTab("user")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-4 h-4 inline ml-2" />
                  کاربر / ارائه‌دهنده
                </button>
                <button
                  onClick={() => switchTab("business")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === "business"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Building2 className="w-4 h-4 inline ml-2" />
                  مدیریت کسب‌وکار
                </button>
                <button
                  onClick={() => switchTab("admin")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === "admin"
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Crown className="w-4 h-4 inline ml-2" />
                  مدیر
                </button>
              </div>

              {activeTab === "user" && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      {isLogin ? "ورود به حساب" : "ثبت‌نام"}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {isLogin ? "خوش آمدید، لطفاً وارد شوید" : "حساب کاربری جدید ایجاد کنید"}
                    </p>
                  </div>

                  <form onSubmit={handleUserSubmit(handleUserLogin)} className="space-y-4">
                    {!isLogin && (
                      <div>
                        <Label required>نام و نام خانوادگی</Label>
                        <Input
                          {...registerUser("name")}
                          placeholder="مثال: علی محمدی"
                          error={userErrors.name?.message}
                        />
                      </div>
                    )}
                    <div>
                      <Label required>ایمیل</Label>
                      <Input
                        {...registerUser("email")}
                        type="email"
                        placeholder="example@email.com"
                        error={userErrors.email?.message}
                      />
                    </div>
                    <div>
                      <Label required>رمز عبور</Label>
                      <Input
                        {...registerUser("password")}
                        type="password"
                        placeholder="••••••••"
                        error={userErrors.password?.message}
                      />
                    </div>
                    {!isLogin && (
                      <div>
                        <Label>شماره تماس</Label>
                        <Input
                          {...registerUser("phone")}
                          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                          error={userErrors.phone?.message}
                        />
                      </div>
                    )}

                    {error && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "در حال پردازش..." : isLogin ? "ورود" : "ثبت‌نام"}
                    </Button>
                  </form>

                  <div className="text-center">
                    <button
                      onClick={() => { setIsLogin(!isLogin); setError(""); resetUser(); }}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {isLogin ? "حساب کاربری ندارید؟ ثبت‌نام کنید" : "قبلاً ثبت‌نام کرده‌اید؟ ورود"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "business" && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      ورود مدیریت کسب‌وکار
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">دسترسی به پنل مدیریت رزرو</p>
                  </div>

                  <form onSubmit={handleBusinessSubmit(handleBusinessLogin)} className="space-y-4">
                    <div>
                      <Label required>نام کاربری</Label>
                      <Input
                        {...registerBusiness("username")}
                        placeholder="نام کاربری"
                        error={businessErrors.username?.message}
                      />
                    </div>
                    <div>
                      <Label required>رمز عبور</Label>
                      <Input
                        {...registerBusiness("password")}
                        type="password"
                        placeholder="••••••••"
                        error={businessErrors.password?.message}
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600" disabled={isLoading}>
                      {isLoading ? "در حال بررسی..." : "ورود به داشبورد کسب‌وکار"}
                    </Button>
                  </form>
                </div>
              )}

              {activeTab === "admin" && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                      ورود مدیر
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">دسترسی به پنل مدیریت</p>
                  </div>

                  <form onSubmit={handleAdminSubmit(handleAdminLogin)} className="space-y-4">
                    <div>
                      <Label required>ایمیل مدیر</Label>
                      <Input
                        {...registerAdmin("email")}
                        type="email"
                        placeholder="pir0918021@gmail.com"
                        error={adminErrors.email?.message}
                      />
                    </div>
                    <div>
                      <Label required>رمز عبور</Label>
                      <Input
                        {...registerAdmin("password")}
                        type="password"
                        placeholder="••••••••"
                        error={adminErrors.password?.message}
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600" disabled={isLoading}>
                      {isLoading ? "در حال بررسی..." : "ورود به پنل مدیریت"}
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-xs text-slate-500">
                      اطلاعات ورود مدیر: pir0918021@gmail.com / Shayan021
                    </p>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
