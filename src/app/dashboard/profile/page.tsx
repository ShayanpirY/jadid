"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Crown, CalendarCheck, Save, ArrowRight, Building2, Mail, Phone, Globe, FileText } from "lucide-react";

type SubscriptionStatus = "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";
type SubscriptionTier = "ONE_MONTH" | "THREE_MONTHS" | "ONE_YEAR";

interface ProviderProfile {
  id: string;
  businessName: string;
  slug: string;
  email: string;
  phone: string;
  bio: string | null;
  category: string | null;
  address: string | null;
  brandColor: string | null;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: SubscriptionTier | null;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const STATUS_CONFIG: Record<SubscriptionStatus, { label: string; variant: "success" | "warning" | "error" | "default" }> = {
  TRIAL: { label: "دوره آزمایشی", variant: "warning" },
  ACTIVE: { label: "فعال", variant: "success" },
  EXPIRED: { label: "منقضی شده", variant: "error" },
  CANCELLED: { label: "لغو شده", variant: "error" },
};

const PLAN_LABELS: Record<SubscriptionTier, string> = {
  ONE_MONTH: "۱ ماهه",
  THREE_MONTHS: "۳ ماهه",
  ONE_YEAR: "سالانه",
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [slugAvailable, setSlugAvailable] = useState(true);

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    bio: "",
    category: "",
    address: "",
    slug: "",
  });

  useEffect(() => {
    const sessionSlug = typeof window !== "undefined" ? localStorage.getItem("business_slug") : null;
    if (!sessionSlug) {
      router.push("/login");
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/dashboard/profile?slug=${sessionSlug}`);
        if (res.ok) {
          const data = await res.json();
          const provider = data.provider;
          setProfile(provider);
          setFormData({
            businessName: provider.businessName || "",
            email: provider.email || "",
            phone: provider.phone || "",
            bio: provider.bio || "",
            category: provider.category || "",
            address: provider.address || "",
            slug: provider.slug || "",
          });
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const sessionSlug = localStorage.getItem("business_slug");
    if (!sessionSlug) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, currentSlug: sessionSlug }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "خطا در به‌روزرسانی");
      }

      if (data.provider && data.provider.slug !== sessionSlug) {
        localStorage.setItem("business_slug", data.provider.slug);
      }

      setProfile(data.provider);
      setSuccess("پروفایل با موفقیت به‌روزرسانی شد");
    } catch (err: any) {
      setError(err.message || "خطا در به‌روزرسانی");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#0d0e15] text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const subscriptionEndDate = profile.subscriptionEnd
    ? new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(profile.subscriptionEnd))
    : "تعیین نشده";

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15] text-white space-y-8 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar name={profile.businessName} size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                پروفایل کسب‌وکار
              </h1>
              <p className="text-slate-400 mt-1">مدیریت اطلاعات و تنظیمات حساب</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            بازگشت به داشبورد
          </Button>
        </div>

        {/* Subscription Card */}
        <GlassCard className="p-6 mb-8 border-purple-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200">وضعیت اشتراک</h3>
              <p className="text-sm text-slate-400">اطلاعات پلان و تاریخ انقضا</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">پلان فعلی</p>
              <p className="text-lg font-bold text-slate-200">
                {profile.subscriptionTier ? PLAN_LABELS[profile.subscriptionTier] : "تعیین نشده"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">وضعیت</p>
              <Badge variant={STATUS_CONFIG[profile.subscriptionStatus].variant}>
                {STATUS_CONFIG[profile.subscriptionStatus].label}
              </Badge>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">تاریخ انقضا</p>
              <p className="text-lg font-bold text-slate-200 flex items-center gap-2">
                {subscriptionEndDate}
                <CalendarCheck className="w-4 h-4 text-slate-400" />
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Profile Form */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200">اطلاعات کسب‌وکار</h3>
              <p className="text-sm text-slate-400">ویرایش مشخصات و لینک اختصاصی</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label required>نام کسب‌وکار</Label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="مثال: کلینیک زیبایی نور"
                />
              </div>

              <div>
                <Label required>شناسه اختصاصی (slug)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setSlugAvailable(true);
                  }}
                  placeholder="my-business"
                  dir="ltr"
                />
                <p className="text-xs text-slate-500 mt-1">
                  لینک نهایی: <span className="text-purple-400">/book/{formData.slug || "..."}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label required>ایمیل</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <Label>شماره تماس</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <Label>دسته‌بندی</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="مثال: کلینیک پوست، آرایشگاه، عکاسی"
              />
            </div>

            <div>
              <Label>آدرس</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="آدرس کسب‌وکار"
              />
            </div>

            <div>
              <Label>توضیحات</Label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="توضیحات مختصر درباره کسب‌وکار..."
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 min-h-[100px]"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-sm text-emerald-400">{success}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")} className="flex-1">
                انصراف
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                {saving ? "در حال ذخیره..." : <><Save className="w-4 h-4 ml-2" /> ذخیره تغییرات</>}
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
