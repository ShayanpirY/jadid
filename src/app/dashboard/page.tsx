"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  ExternalLink,
  CalendarCheck,
  Clock,
  AlertCircle,
  Crown,
  Search,
  Check,
  X,
  Settings2,
  Bell,
  CreditCard,
  ChevronRight,
  Filter,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  Building2,
  Users,
} from "lucide-react";
import BookingLinkCard from "@/components/BookingLinkCard";

type Tab = "appointments" | "settings" | "subscription";
type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; variant: "warning" | "success" | "error" }> = {
  PENDING: { label: "در انتظار", variant: "warning" },
  CONFIRMED: { label: "تایید شده", variant: "success" },
  CANCELLED: { label: "لغو شده", variant: "error" },
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
};

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    customerName: "علی رضایی",
    customerPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    service: "مشاوره تخصصی",
    date: "۱۴۰۵/۰۵/۱۶",
    time: "۱۵:۰۰",
    status: "CONFIRMED",
  },
  {
    id: "2",
    customerName: "سارا کریمی",
    customerPhone: "۰۹۱۳۴۵۶۷۸۹۰",
    service: "جلسه پیگیری",
    date: "۱۴۰۵/۰۵/۱۷",
    time: "۱۰:۳۰",
    status: "PENDING",
  },
  {
    id: "3",
    customerName: "رضا احمدی",
    customerPhone: "۰۹۱۴۵۶۷۸۹۰۱",
    service: "مشاوره تخصصی",
    date: "۱۴۰۵/۰۵/۱۵",
    time: "۱۱:۰۰",
    status: "CONFIRMED",
  },
  {
    id: "4",
    customerName: "مریم حسینی",
    customerPhone: "۰۹۱۵۶۷۸۹۰۱۲",
    service: "جلسه پیگیری",
    date: "۱۴۰۵/۰۵/۱۸",
    time: "۰۹:۰۰",
    status: "CANCELLED",
  },
];

export default function BusinessDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AppointmentStatus>("ALL");

  const businessName = "مجموعه شایان";
  const slug = "shayan";

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.customerPhone.includes(searchQuery) ||
        apt.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const today = appointments.filter((a) => a.date === "۱۴۰۵/۰۵/۱۵").length;
    const pending = appointments.filter((a) => a.status === "PENDING").length;
    return [
      { label: "کل رزروها", value: total.toString(), icon: <CalendarCheck className="w-5 h-5" />, color: "purple" },
      { label: "امروز", value: today.toString(), icon: <Clock className="w-5 h-5" />, color: "cyan" },
      { label: "در انتظار", value: pending.toString(), icon: <AlertCircle className="w-5 h-5" />, color: "amber" },
      { label: "روزهای باقی‌مانده", value: "۳۶۵", icon: <Crown className="w-5 h-5" />, color: "emerald" },
    ];
  }, [appointments]);

  const handleApprove = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "CONFIRMED" as AppointmentStatus } : apt))
    );
  };

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "CANCELLED" as AppointmentStatus } : apt))
    );
  };

  const tabs = [
    { id: "appointments" as Tab, label: "مدیریت رزروها", icon: <CalendarCheck className="w-4 h-4" /> },
    { id: "settings" as Tab, label: "تنظیمات", icon: <Settings2 className="w-4 h-4" /> },
    { id: "subscription" as Tab, label: "اشتراک", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15] text-white space-y-8 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Avatar name={businessName} size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                خوش آمدید، {businessName} 👋
              </h1>
              <p className="text-slate-400 mt-1">مدیریت رزرو و اشتراک</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/dashboard/profile")} className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              پروفایل
            </Button>
          </div>
        </div>

        {/* Booking Link Card */}
        <BookingLinkCard businessSlug={slug} businessName={businessName} defaultClient="amir" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-6" hover>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      stat.color === "emerald"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : stat.color === "amber"
                        ? "bg-amber-500/20 text-amber-400"
                        : stat.color === "cyan"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : stat.color === "pink"
                        ? "bg-pink-500/20 text-pink-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white/5 rounded-xl p-1 border border-white/10 mb-6">
          <div className="flex flex-col sm:flex-row gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "appointments" && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Filters */}
              <GlassCard className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="جستجو با نام، شماره تماس یا سرویس..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as "ALL" | AppointmentStatus)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="ALL">همه وضعیت‌ها</option>
                      <option value="PENDING">در انتظار</option>
                      <option value="CONFIRMED">تایید شده</option>
                      <option value="CANCELLED">لغو شده</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              {/* Appointments Table */}
              <GlassCard className="overflow-hidden">
                {filteredAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <CalendarCheck className="w-12 h-12 mb-4 opacity-50" />
                    <p>هیچ رزروی یافت نشد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">مشتری</th>
                          <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">سرویس</th>
                          <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">تاریخ</th>
                          <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">ساعت</th>
                          <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">وضعیت</th>
                          <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.map((apt, index) => (
                          <motion.tr
                            key={apt.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div>
                                <p className="font-medium text-slate-200">{apt.customerName}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                  <Phone className="w-3 h-3" />
                                  {apt.customerPhone}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-400">{apt.service}</td>
                            <td className="py-4 px-6 text-sm text-slate-400">{apt.date}</td>
                            <td className="py-4 px-6 text-sm text-slate-400">{apt.time}</td>
                            <td className="py-4 px-6">
                              <Badge variant={STATUS_CONFIG[apt.status].variant}>
                                {STATUS_CONFIG[apt.status].label}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                {apt.status === "PENDING" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="primary"
                                      onClick={() => handleApprove(apt.id)}
                                      className="text-xs px-3 py-1.5"
                                    >
                                      تایید
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleCancel(apt.id)}
                                      className="text-xs px-3 py-1.5 text-pink-400 hover:text-pink-300"
                                    >
                                      لغو
                                    </Button>
                                  </>
                                )}
                                {apt.status === "CONFIRMED" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCancel(apt.id)}
                                    className="text-xs px-3 py-1.5 text-pink-400 hover:text-pink-300"
                                  >
                                    لغو
                                  </Button>
                                )}
                                {apt.status === "CANCELLED" && (
                                  <span className="text-xs text-slate-500">—</span>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Working Hours */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">ساعات کاری</h3>
                    <p className="text-sm text-slate-400">تعیین بازه زمانی برای رزرو</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>ساعت شروع</Label>
                    <Input
                      type="time"
                      value="09:00"
                      onChange={(e) => {}}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>ساعت پایان</Label>
                    <Input
                      type="time"
                      value="18:00"
                      onChange={(e) => {}}
                      className="mt-1"
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Session Settings */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">تنظیمات سانس</h3>
                    <p className="text-sm text-slate-400">مدیریت طول سانس و زمان استراحت</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>طول هر سانس (دقیقه)</Label>
                    <Input
                      type="number"
                      value={45}
                      onChange={(e) => {}}
                      className="mt-1"
                      min={15}
                      max={180}
                    />
                  </div>
                  <div>
                    <Label>زمان استراحت بین سانس‌ها (دقیقه)</Label>
                    <Input
                      type="number"
                      value={10}
                      onChange={(e) => {}}
                      className="mt-1"
                      min={0}
                      max={60}
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Notifications */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">اعلان‌ها</h3>
                    <p className="text-sm text-slate-400">مدیریت نوع اعلان‌های ارسالی به مشتریان</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-200">اعلان پیامکی</p>
                        <p className="text-xs text-slate-400">ارسال پیامک برای تایید و یادآوری نوبت</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {}}
                      className={`w-12 h-6 rounded-full transition-all duration-300 bg-purple-600`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 translate-x-6`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-200">اعلان ایمیلی</p>
                        <p className="text-xs text-slate-400">ارسال ایمیل برای تایید و یادآوری نوبت</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {}}
                      className={`w-12 h-6 rounded-full transition-all duration-300 bg-purple-600`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 translate-x-6`} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "subscription" && (
            <motion.div
              key="subscription"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">وضعیت اشتراک</h3>
                    <p className="text-sm text-slate-400">مدیریت و تمدید اشتراک کسب‌وکار</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm text-slate-400">پلان فعلی</p>
                      <p className="text-lg font-bold text-slate-200">یک‌ساله</p>
                    </div>
                    <Badge variant="success">فعال</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm text-slate-400">تاریخ انقضا</p>
                      <p className="text-lg font-bold text-slate-200">۱۴۰۶/۰۵/۱۵</p>
                    </div>
                    <CalendarCheck className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium text-slate-300 mb-4">تمدید اشتراک</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "ONE_MONTH", label: "۱ ماه", price: "۲۹۰,۰۰۰" },
                      { value: "THREE_MONTHS", label: "۳ ماه", price: "۷۹۰,۰۰۰" },
                      { value: "ONE_YEAR", label: "۱ سال", price: "۲,۵۰۰,۰۰۰" },
                    ].map((plan) => (
                      <button
                        key={plan.value}
                        onClick={() => {}}
                        className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                          plan.value === "ONE_YEAR"
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <p className="font-bold text-slate-200">{plan.label}</p>
                        <p className="text-xs text-slate-400 mt-1">{plan.price} تومان</p>
                      </button>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600">
                    تمدید اشتراک
                    <ChevronLeft className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
