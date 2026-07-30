"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import type { Appointment, Service } from "@/types";

interface DashboardStatsProps {
  providerSlug: string;
}

export default function DashboardStats({ providerSlug }: DashboardStatsProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/dashboard/${providerSlug}`);
        const data = await res.json();
        setServices(data.services || []);
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [providerSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalAppointments = appointments.length;
  const totalRevenue = appointments.reduce((sum, apt) => {
    const service = services.find((s) => s.id === apt.serviceId);
    return sum + (service?.price || 0);
  }, 0);
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const cancelledCount = appointments.filter((a) => a.status === "CANCELLED").length;

  const stats = [
    {
      title: "کل رزروها",
      value: totalAppointments.toString(),
      change: "+۱۲٪ این ماه",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "درآمد کل",
      value: `${totalRevenue.toLocaleString("fa-IR")} تومان`,
      change: "+۸٪ این ماه",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "تایید شده",
      value: confirmedCount.toString(),
      change: `${((confirmedCount / Math.max(totalAppointments, 1)) * 100).toFixed(0)}٪`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "لغو شده",
      value: cancelledCount.toString(),
      change: `${((cancelledCount / Math.max(totalAppointments, 1)) * 100).toFixed(0)}٪`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm text-slate-400 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{stat.value}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">رزروهای اخیر</h3>
            {recentAppointments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>هنوز رزروی ثبت نشده است</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                        {apt.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{apt.customerName}</p>
                        <p className="text-sm text-slate-400">{apt.customerPhone}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-cyan-400">{apt.time}</p>
                      <p className="text-xs text-slate-500">{apt.date}</p>
                    </div>
                    <Badge
                      variant={
                        apt.status === "CONFIRMED"
                          ? "success"
                          : apt.status === "CANCELLED"
                          ? "error"
                          : "default"
                      }
                    >
                      {apt.status === "CONFIRMED" && "تایید شده"}
                      {apt.status === "CANCELLED" && "لغو شده"}
                      {apt.status === "COMPLETED" && "انجام شده"}
                      {apt.status === "NO_SHOW" && "عدم حضور"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        <div>
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">خدمات شما</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <h4 className="font-medium text-slate-200 mb-1">{service.title}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{service.durationMinutes} دقیقه</span>
                    <span className="font-bold text-purple-400">
                      {service.price.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-center text-slate-500 py-8 text-sm">
                  هنوز خدمتی تعریف نکرده‌اید
                </p>
              )}
            </div>
            <div className="mt-6">
              <a
                href={`/dashboard/${providerSlug}/services`}
                className="block"
              >
                <Button variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10">
                  مدیریت خدمات
                </Button>
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
