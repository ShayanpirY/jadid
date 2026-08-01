"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Logo } from "@/components/ui/logo";
import { CalendarDays, Sparkles, Clock, Shield, Smartphone, Star, ArrowRight } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const features = [
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: "تقویم شمسی",
    description: "پشتیبانی کامل از تقویم شمسی و slots زمانی هوشمند.",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "کاملاً واکنش‌گرا",
    description: "تجربه کاربری عالی روی موبایل، تبلت و دسکتاپ.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "امن و پایدار",
    description: "رمزگذاری و پشتیبان‌گیری منظم از داده‌های شما.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "رزرو آنلاین",
    description: "مشتریان به راحتی نوبت خود را انتخاب و رزرو کنند.",
  },
];

const plans = [
  {
    name: "یک ماهه",
    price: "۲۹۰,۰۰۰",
    period: "تومان/ماه",
    popular: false,
  },
  {
    name: "سه ماهه",
    price: "۷۹۰,۰۰۰",
    period: "تومان/۳ ماه",
    popular: true,
  },
  {
    name: "یک ساله",
    price: "۲,۵۰۰,۰۰۰",
    period: "تومان/سال",
    popular: false,
  },
];

const testimonials = [
  {
    name: "رضا محمدی",
    role: "مدیر سالن زیبایی",
    text: "پلتفرم فوق‌العاده‌ای است. مدیریت رزروها خیلی ساده‌تر شد.",
  },
  {
    name: "سارا احمدی",
    role: "متخصص تغذیه",
    text: "از قابلیت یادآوری پیامکی و تقویم شمسی خیلی راضی هستم.",
  },
  {
    name: "امیر حسینی",
    role: "عکاس",
    text: "رزروهای آتلیه من کاملاً منظم شد. پشتیبانی عالی.",
  },
];

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <main dir="rtl" className="min-h-screen bg-[#0d0e15] text-white space-y-24 py-12 px-4 md:px-8">
      {/* هدر */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d0e15]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                نوبت رو
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <a href="#features" className="hover:text-purple-400 transition-colors">ویژگی‌ها</a>
              <a href="#pricing" className="hover:text-purple-400 transition-colors">اشتراک</a>
              <a href="#testimonials" className="hover:text-purple-400 transition-colors">نظرات</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="/demo">
                <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
                  دموی نوبت‌گیری
                </Button>
              </a>
              <Button size="sm" variant="ghost" onClick={() => setAuthOpen(true)} className="hidden sm:inline-flex">
                ورود / ثبت‌نام
              </Button>
              <Button size="sm" className="shadow-lg shadow-purple-500/30">
                شروع رایگان
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* بخش معرفی Hero */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">پلتفرم رزرو آنلاین</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              سیستم نوبت‌دهی و رزرو آنلاین اختصاصی
            </span>
            <br />
            <span className="text-slate-200 text-3xl sm:text-4xl lg:text-5xl mt-2 block">
              — لینک خود را بسازید و به مشتریان بدهید.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            با چند کلیک پیج اختصاصی رزرو دریافت کنید. مشتریان به راحتی سرویس شما را انتخاب، ساعت مناسب را رزرو کنند و پرداخت را آنلاین انجام دهند.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="shadow-lg shadow-purple-500/30">
              شروع رایگان
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            <a href="/demo">
              <Button size="lg" variant="ghost">
                دموی زنده
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* بخش ویژگی‌ها */}
      <section id="features" className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4">
            ویژگی‌های اصلی
          </h2>
          <p className="text-slate-400">
            تمام ابزارهای مورد نیاز برای مدیریت نوبت‌دهی و رزرو آنلاین را در یک پلتفرم جمع آوری کردیم.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 h-full hover:shadow-xl transition-all duration-300" hover>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* بخش اشتراک */}
      <section id="pricing" className="max-w-7xl mx-auto py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
            اشتراک
          </h2>
          <p className="text-slate-400">پلان مناسب خود را انتخاب کنید</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                className={`p-6 h-full ${plan.popular ? "border-2 border-purple-500 shadow-xl shadow-purple-500/20" : ""}`}
                hover
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg">
                    ⭐ پرفروش‌ترین
                  </div>
                )}
                <h3 className="text-lg font-bold text-slate-200">{plan.name}</h3>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-4">
                  {plan.price}
                  <span className="text-sm font-normal text-slate-400 mr-1">{plan.period}</span>
                </p>
                <Button className="w-full mt-6" variant={plan.popular ? "primary" : "outline"}>
                  انتخاب پلان
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* بخش نظرات مشتریان */}
      <section id="testimonials" className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
            نظرات مشتریان
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, idx) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="p-6 h-full" hover>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{review.name}</h4>
                    <p className="text-sm text-slate-400">{review.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{review.text}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* فوتر */}
      <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                نوبت رو
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#features" className="hover:text-purple-400 transition-colors">ویژگی‌ها</a>
              <a href="#pricing" className="hover:text-purple-400 transition-colors">اشتراک</a>
              <a href="#testimonials" className="hover:text-purple-400 transition-colors">نظرات</a>
            </div>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} نوبت رو. تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(role) => {
          if (role === "ADMIN") {
            window.location.href = "/admin/users";
          }
        }}
      />
    </main>
  );
}
