"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  CalendarCheck,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Settings2,
  CreditCard,
} from "lucide-react";

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

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    customerName: "امیر رضایی",
    customerPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    service: "مشاوره تخصصی",
    date: "۱۴۰۵/۰۵/۱۶",
    time: "۱۵:۰۰",
    status: "CONFIRMED",
  },
  {
    id: "2",
    customerName: "علی محمدی",
    customerPhone: "۰۹۱۳۴۵۶۷۸۹۰",
    service: "جلسه پیگیری",
    date: "۱۴۰۵/۰۵/۱۷",
    time: "۱۰:۳۰",
    status: "PENDING",
  },
  {
    id: "3",
    customerName: "سارا احمدی",
    customerPhone: "۰۹۱۴۵۶۷۸۹۰۱",
    service: "مشاوره تخصصی",
    date: "۱۴۰۵/۰۵/۱۵",
    time: "۱۱:۰۰",
    status: "CONFIRMED",
  },
];

export default function AmirDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [copied, setCopied] = useState(false);

  const bookingUrl = "https://shayanreserve.com/booking/amir";

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Avatar name="امیر رضایی" size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                خوش آمدید، امیر 👋
              </h1>
              <p className="text-slate-400 mt-1">مدیریت رزرو و اشتراک</p>
            </div>
          </div>
        </div>

        <GlassCard className="p-6 mb-8 border-purple-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm text-slate-200 font-mono truncate">{bookingUrl}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={copyToClipboard} className="flex items-center gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "کپی شد" : "کپی لینک"}
              </Button>
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  مشاهده
                </Button>
              </a>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "کل رزروها", value: appointments.length.toString(), icon: <CalendarCheck className="w-5 h-5" />, color: "purple" },
            { label: "امروز", value: "۲", icon: <Clock className="w-5 h-5" />, color: "cyan" },
            { label: "در انتظار", value: appointments.filter((a) => a.status === "PENDING").length.toString(), icon: <Clock className="w-5 h-5" />, color: "amber" },
            { label: "وضعیت اشتراک", value: "فعال", icon: <CreditCard className="w-5 h-5" />, color: "emerald" },
          ].map((stat, i) => (
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

        {activeTab === "appointments" && (
          <GlassCard className="overflow-hidden">
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
                  {appointments.map((apt, index) => (
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
                          <p className="text-xs text-slate-400">{apt.customerPhone}</p>
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
          </GlassCard>
        )}

        {activeTab === "settings" && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-slate-200 mb-4">تنظیمات</h3>
            <p className="text-sm text-slate-400">تنظیمات پنل امیر در اینجا قرار می‌گیرد.</p>
          </GlassCard>
        )}

        {activeTab === "subscription" && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-slate-200 mb-4">وضعیت اشتراک</h3>
            <p className="text-sm text-slate-400">اشتراک فعال امیر با قابلیت تمدید.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
