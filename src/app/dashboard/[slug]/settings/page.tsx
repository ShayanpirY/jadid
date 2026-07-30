"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Provider, Service, Availability } from "@/types";
import { Save, Upload, Globe, Phone, MapPin, Palette, Clock, CreditCard, User } from "lucide-react";

type Tab = "branding" | "services" | "hours" | "subscription";

interface SettingsPageProps {
  providerSlug: string;
}

export default function SettingsPage({ providerSlug }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("branding");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/dashboard/${providerSlug}`);
        const data = await res.json();
        setProvider(data.provider || null);
        setServices(data.services || []);
        setAvailability(data.availability || []);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [providerSlug]);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    showSaved();
    setSaving(false);
  };

  const tabs = [
    { id: "branding" as Tab, label: "برندینگ", icon: <Palette className="w-4 h-4" /> },
    { id: "services" as Tab, label: "خدمات", icon: <User className="w-4 h-4" /> },
    { id: "hours" as Tab, label: "ساعات کاری", icon: <Clock className="w-4 h-4" /> },
    { id: "subscription" as Tab, label: "اشتراک", icon: <CreditCard className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">تنظیمات</h1>
        <p className="text-slate-400 mt-1">شخصی‌سازی پروفایل و تنظیمات کسب‌وکار</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="md:w-64 flex-shrink-0">
          <GlassCard className="p-2">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === "branding" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">
                  اطلاعات کسب‌وکار
                </h3>
                <form onSubmit={handleSaveBranding} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>نام کسب‌وکار</Label>
                      <Input defaultValue={provider?.businessName || ""} placeholder="مثال: کلینیک تخصصی درمانی" />
                    </div>
                    <div>
                      <Label required>دسته‌بندی</Label>
                      <Input defaultValue={provider?.category || ""} placeholder="مثال: پزشکی، زیبایی، ورزشی" />
                    </div>
                  </div>
                  <div>
                    <Label>درباره ما</Label>
                    <textarea
                      defaultValue={provider?.bio || ""}
                      placeholder="توضیحات کوتاه درباره کسب‌وکار..."
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>شماره تماس</Label>
                      <Input defaultValue={provider?.phone || ""} placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
                    </div>
                    <div>
                      <Label required>ایمیل</Label>
                      <Input defaultValue={provider?.email || ""} placeholder="info@example.com" />
                    </div>
                  </div>
                  <div>
                    <Label>آدرس</Label>
                    <Input defaultValue={provider?.address || ""} placeholder="تهران، خیابان ولیعصر" />
                  </div>

                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pt-4">لینک‌های شبکه‌های اجتماعی</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <Label>اینستاگرام</Label>
                      <Input defaultValue={provider?.instagramUrl || ""} placeholder="instagram.com/username" />
                    </div>
                    <div>
                      <Label>تلگرام</Label>
                      <Input defaultValue={provider?.telegramUrl || ""} placeholder="t.me/username" />
                    </div>
                    <div>
                      <Label>گوگل مپس</Label>
                      <Input defaultValue={provider?.googleMapsUrl || ""} placeholder="لینک موقعیت مکانی" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="submit" disabled={saving}>
                      <Save className="w-4 h-4 ml-2" />
                      {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </Button>
                    {saved && <Badge variant="success">✅ تغییرات ذخیره شد</Badge>}
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "services" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">مدیریت خدمات</h3>
                <Button>
                  <User className="w-4 h-4 ml-2" />
                  افزودن خدمت
                </Button>
              </div>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard className={`p-5 ${!service.isActive ? "opacity-60" : ""}`} hover>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-slate-200">{service.title}</h4>
                          {service.description && (
                            <p className="text-sm text-slate-400 mt-1">{service.description}</p>
                          )}
                        </div>
                        <Badge variant={service.isActive ? "success" : "default"}>
                          {service.isActive ? "فعال" : "غیرفعال"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-slate-400">{service.durationMinutes} دقیقه</span>
                        <span className="font-bold text-purple-400">
                          {service.price.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="flex-1">
                          {service.isActive ? "غیرفعال" : "فعال"}
                        </Button>
                        <Button size="sm" variant="secondary" className="flex-1">
                          ویرایش
                        </Button>
                        <Button size="sm" variant="ghost" className="text-pink-400 hover:text-pink-300">
                          حذف
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "hours" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">ساعات کاری</h3>
              <GlassCard className="p-6">
                <div className="space-y-4">
                  {["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"].map((day, index) => (
                    <div key={day} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked={day !== "جمعه"}
                          className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-medium text-slate-200 w-20">{day}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="time"
                          defaultValue="09:00"
                          className="w-32"
                        />
                        <span className="text-slate-400">تا</span>
                        <Input
                          type="time"
                          defaultValue="17:00"
                          className="w-32"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <Button>
                    <Save className="w-4 h-4 ml-2" />
                    ذخیره ساعات کاری
                  </Button>
                  {saved && <Badge variant="success">✅ تغییرات ذخیره شد</Badge>}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "subscription" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">مدیریت اشتراک</h3>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-bold text-slate-200">پلان فعلی</h4>
                    <p className="text-sm text-slate-400">
                      {provider?.subscriptionTier === "ONE_MONTH" && "یک ماهه"}
                      {provider?.subscriptionTier === "THREE_MONTHS" && "سه ماهه"}
                      {provider?.subscriptionTier === "ONE_YEAR" && "یک ساله"}
                    </p>
                  </div>
                  <Badge variant={provider?.subscriptionStatus === "ACTIVE" ? "success" : "warning"}>
                    {provider?.subscriptionStatus === "ACTIVE" ? "فعال" : "دوره آزمایشی"}
                  </Badge>
                </div>
                <Button className="w-full">تمدید اشتراک</Button>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
