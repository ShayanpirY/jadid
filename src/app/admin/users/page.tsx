"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { UserRoleBadge } from "@/components/UserRoleBadge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Crown, User, Search, Filter } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "ADMIN" | "PROVIDER" | "CLIENT";
  providerId: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchUsers() {
      try {
        await new Promise((r) => setTimeout(r, 800));
        setUsers([
          { id: "1", email: "admin@nobatro.ir", name: "مدیر سیستم", phone: "۰۹۱۲۰۰۰۰۰۰۰", role: "ADMIN", providerId: null, createdAt: "۱۴۰۳/۰۱/۱۵" },
          { id: "2", email: "dr.mohammadi@clinic.ir", name: "دکتر علی محمدی", phone: "۰۹۱۲۳۴۵۶۷۸۹", role: "PROVIDER", providerId: "prov_1", createdAt: "۱۴۰۳/۰۲/۲۰" },
          { id: "3", email: "salon@royal.ir", name: "سالن زیبایی رویال", phone: "۰۹۱۳۴۵۶۷۸۹۰", role: "PROVIDER", providerId: "prov_2", createdAt: "۱۴۰۳/۰۳/۱۰" },
          { id: "4", email: "ali@example.com", name: "علی رضایی", phone: "۰۹۱۴۵۶۷۸۹۰۱", role: "CLIENT", providerId: null, createdAt: "۱۴۰۳/۰۴/۰۵" },
          { id: "5", email: "sara@example.com", name: "سارا احمدی", phone: "۰۹۱۵۶۷۸۹۰۱۲", role: "CLIENT", providerId: null, createdAt: "۱۴۰۳/۰۴/۱۲" },
          { id: "6", email: "reza@example.com", name: "رضا کریمی", phone: "۰۹۱۶۷۸۹۰۱۲۳", role: "CLIENT", providerId: null, createdAt: "۱۴۰۳/۰۵/۰۱" },
          { id: "7", email: "nutrition@diet.ir", name: "متخصص تغذیه", phone: "۰۹۱۷۸۹۰۱۲۳۴", role: "PROVIDER", providerId: "prov_3", createdAt: "۱۴۰۳/۰۵/۱۵" },
        ]);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.includes(searchQuery) || user.name?.includes(searchQuery) || user.phone?.includes(searchQuery);
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: "ADMIN" | "PROVIDER" | "CLIENT") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const stats = [
    { label: "کل کاربران", value: users.length.toString(), icon: <User className="w-5 h-5" />, color: "cyan" },
    { label: "مدیران", value: users.filter((u) => u.role === "ADMIN").length.toString(), icon: <Crown className="w-5 h-5" />, color: "amber" },
    { label: "ارائه‌دهندگان", value: users.filter((u) => u.role === "PROVIDER").length.toString(), icon: <Shield className="w-5 h-5" />, color: "purple" },
    { label: "کاربران", value: users.filter((u) => u.role === "CLIENT").length.toString(), icon: <User className="w-5 h-5" />, color: "cyan" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15] text-white space-y-8 py-12 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              مدیریت کاربران
            </h1>
            <p className="text-slate-400 mt-1">مشاهده و تغییر سطح دسترسی کاربران</p>
          </div>
          <Badge variant="neon">پنل مدیریت</Badge>
        </div>

        {/* Stats */}
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === "amber" ? "bg-amber-500/20 text-amber-400" :
                    stat.color === "purple" ? "bg-purple-500/20 text-purple-400" :
                    "bg-cyan-500/20 text-cyan-400"
                  }`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="جستجو با نام، ایمیل یا شماره تماس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
              >
                <option value="ALL">همه نقش‌ها</option>
                <option value="ADMIN">مدیر</option>
                <option value="PROVIDER">ارائه‌دهنده</option>
                <option value="CLIENT">کاربر</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Users Table */}
        <GlassCard className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">کاربر</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">ایمیل</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">شماره تماس</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">نقش</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">تاریخ عضویت</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name || user.email} size="sm" />
                          <span className="font-medium text-slate-200">{user.name || "بدون نام"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">{user.email}</td>
                      <td className="py-4 px-6 text-sm text-slate-400">{user.phone || "-"}</td>
                      <td className="py-4 px-6">
                        <UserRoleBadge role={user.role} />
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">{user.createdAt}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as "ADMIN" | "PROVIDER" | "CLIENT")}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                          >
                            <option value="ADMIN">مدیر</option>
                            <option value="PROVIDER">ارائه‌دهنده</option>
                            <option value="CLIENT">کاربر</option>
                          </select>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
