"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Check, CreditCard, Sparkles, ArrowRight } from "lucide-react";

type Plan = "ONE_MONTH" | "THREE_MONTHS" | "ONE_YEAR";

const PLANS: { id: Plan; name: string; price: string; period: string; popular?: boolean }[] = [
  { id: "ONE_MONTH", name: "یک ماهه", price: "۲۹۰,۰۰۰", period: "تومان/ماه" },
  { id: "THREE_MONTHS", name: "سه ماهه", price: "۷۹۰,۰۰۰", period: "تومان/۳ ماه", popular: true },
  { id: "ONE_YEAR", name: "یک ساله", price: "۲,۵۰۰,۰۰۰", period: "تومان/سال" },
];

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    slug: "",
    plan: "THREE_MONTHS" as Plan,
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
      .slice(0, 30);
  };

  const handleBusinessNameChange = (value: string) => {
    updateField("businessName", value);
    if (!formData.slug) {
      updateField("slug", generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.businessName || !formData.email || !formData.password || !formData.slug) {
      setError("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت‌نام");
      }

      setStep("payment");
    } catch (err: any) {
      setError(err.message || "خطا در ثبت‌نام");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("success");
  };

  const bookingUrl = typeof window !== "undefined" ? `${window.location.origin}/book/${formData.slug}` : "";

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15] text-white py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            ثبت‌نام کسب‌وکار
          </h1>
          <p className="text-slate-400 mt-2">در چند دقیقه پیج رزرو اختصاصی خود را بسازید</p>
        </div>

        {step === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label required>نام کسب‌وکار</Label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => handleBusinessNameChange(e.target.value)}
                    placeholder="مثال: کلینیک زیبایی نور"
                  />
                </div>

                <div>
                  <Label required>ایمیل</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="example@email.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <Label required>رمز عبور</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <Label required>شناسه اختصاصی (slug)</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="my-business"
                    dir="ltr"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    لینک نهایی: <span className="text-purple-400">/book/{formData.slug || "..."}</span>
                  </p>
                </div>

                <div>
                  <Label required>پلان اشتراک</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => updateField("plan", plan.id)}
                        className={`p-4 rounded-xl border text-center transition-all relative ${
                          formData.plan === plan.id
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold">
                            پرفروش
                          </span>
                        )}
                        <p className="font-bold text-slate-200">{plan.name}</p>
                        <p className="text-lg font-bold text-purple-400 mt-1">{plan.price}</p>
                        <p className="text-xs text-slate-400">{plan.period}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "در حال پردازش..." : "ادامه به درگاه پرداخت"}
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {step === "payment" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  پرداخت و فعال‌سازی
                </h2>
                <p className="text-sm text-slate-400 mt-1">برای فعال‌سازی حساب، مبلغ اشتراک را پرداخت کنید</p>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">کسب‌وکار:</span>
                  <span className="text-slate-200">{formData.businessName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">پلان:</span>
                  <span className="text-slate-200">{PLANS.find((p) => p.id === formData.plan)?.name}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-200">مبلغ قابل پرداخت:</span>
                  <span className="font-bold text-emerald-400 text-lg">
                    {PLANS.find((p) => p.id === formData.plan)?.price} تومان
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setStep("form")}
                  className="flex-1"
                >
                  بازگشت
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600"
                >
                  {loading ? "در حال پردازش..." : "پرداخت آنلاین"}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlassCard className="p-6 sm:p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>

              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                ثبت‌نام با موفقیت انجام شد!
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                پیج رزرو اختصاصی شما آماده است. لینک زیر را کپی و به مشتریان بدهید:
              </p>

              <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
                <p className="text-sm text-slate-400 mb-2">لینک اختصاصی رزرو:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-slate-950 rounded-lg p-3 text-purple-400 font-mono break-all">
                    {bookingUrl}
                  </code>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(bookingUrl)}
                  className="flex-1"
                >
                  کپی لینک
                </Button>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="flex-1"
                >
                  ورود به داشبورد
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
