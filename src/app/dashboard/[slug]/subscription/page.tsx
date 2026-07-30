"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "bronze",
    name: "برنز",
    subtitle: "پایه",
    monthlyPrice: "۲۹۰,۰۰۰",
    yearlyPrice: "۲,۷۸۰,۰۰۰",
    features: [
      "لینک اختصاصی",
      "تا ۵۰ رزرو در ماه",
      "تقویم شمسی",
      "پشتیبانی تیکتی",
    ],
  },
  {
    id: "silver",
    name: "نقره‌ای",
    subtitle: "حرفه‌ای - پیشنهاد ویژه",
    monthlyPrice: "۵۹۰,۰۰۰",
    yearlyPrice: "۵,۶۶۰,۰۰۰",
    popular: true,
    features: [
      "لینک اختصاصی با اسم برند",
      "رزرو نامحدود",
      "ارسال پیامک یادآوری",
      "اتصال به درگاه پرداخت",
      "گزارش‌گیری مالی",
    ],
  },
  {
    id: "gold",
    name: "طلایی",
    subtitle: "سازمانی",
    monthlyPrice: "۹۹۰,۰۰۰",
    yearlyPrice: "۹,۵۰۰,۰۰۰",
    features: [
      "تمام امکانات نقره‌ای",
      "تعریف چند پرسنل همزمان",
      "پنل مدیریت پیشرفته",
      "دامنه اختصاصی",
      "پشتیبانی ۲۴/۷ تلفنی",
    ],
  },
];

interface SubscriptionPageProps {
  providerSlug: string;
}

export default function SubscriptionPage({ providerSlug }: SubscriptionPageProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("TRIAL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/dashboard/${providerSlug}`);
        const data = await res.json();
        setSubscriptionStatus(data.provider?.subscriptionStatus || "TRIAL");
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [providerSlug]);

  const getStatusBadge = () => {
    switch (subscriptionStatus) {
      case "ACTIVE":
        return <Badge variant="success">فعال</Badge>;
      case "TRIAL":
        return <Badge variant="warning">دوره آزمایشی</Badge>;
      case "EXPIRED":
        return <Badge variant="error">منقضی شده</Badge>;
      default:
        return <Badge variant="default">{subscriptionStatus}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">مدیریت اشتراک</h1>
          <p className="text-slate-400 mt-1">وضعیت اشتراک و تمدید</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">وضعیت:</span>
          {getStatusBadge()}
        </div>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-200">پلان فعلی: برنز</h3>
            <p className="text-sm text-slate-400">اشتراک شما در حال فعال است</p>
          </div>
          <Button>تمدید اشتراک</Button>
        </div>
      </GlassCard>

      <div>
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm font-medium ${!isYearly ? "text-purple-400" : "text-slate-400"}`}>
            ماهانه
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 h-8 bg-slate-800 rounded-full transition-colors duration-300 focus:outline-none border border-white/10"
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-md transition-transform duration-300 ${
                isYearly ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? "text-purple-400" : "text-slate-400"}`}>
            سالانه
          </span>
          {isYearly && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              ٪۲۰ تخفیف ویژه
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-white/5 backdrop-blur-xl rounded-2xl border p-6 shadow-lg transition-all duration-300 relative",
                plan.popular
                  ? "border-2 border-purple-500 shadow-xl shadow-purple-500/20"
                  : "border-white/10 hover:shadow-xl"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg">
                  ⭐ پرفروش‌ترین
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-200">{plan.name}</h3>
                <p className="text-sm text-slate-400">{plan.subtitle}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-slate-400 text-sm mr-1">
                  {isYearly ? "تومان/سال" : "تومان/ماه"}
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "primary" : "outline"}
              >
                {plan.popular ? "ارتقا به نقره‌ای" : "انتخاب پلان"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
