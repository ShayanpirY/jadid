"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Search,
  Building2,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  MoreVertical,
  ExternalLink,
  Settings,
  Ban,
  BarChart3,
  X,
  ChevronDown,
  Check,
} from "lucide-react";

type SubscriptionStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";
type PlanType = "ONE_MONTH" | "THREE_MONTHS" | "ONE_YEAR";

interface Tenant {
  id: string;
  businessName: string;
  slug: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  subscriptionStatus: SubscriptionStatus;
  planType: PlanType;
  subscriptionEnd: string;
  totalBookings: number;
  revenue: number;
}

const MOCK_TENANTS: Tenant[] = [
  {
    id: "1",
    businessName: "دکتر مریم زمانی",
    slug: "dr-maryam",
    email: "dr.maryam@clinic.ir",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    logoUrl: null,
    subscriptionStatus: "ACTIVE",
    planType: "ONE_YEAR",
    subscriptionEnd: "۱۴۰۵/۰۱/۱۵",
    totalBookings: 1240,
    revenue: 185000000,
  },
  {
    id: "2",
    businessName: "سالن زیبایی رویال",
    slug: "royal-salon",
    email: "salon@royal.ir",
    phone: "۰۹۱۳۴۵۶۷۸۹۰",
    logoUrl: null,
    subscriptionStatus: "EXPIRING_SOON",
    planType: "THREE_MONTHS",
    subscriptionEnd: "۱۴۰۳/۰۸/۲۰",
    totalBookings: 856,
    revenue: 124000000,
  },
  {
    id: "3",
    businessName: "متخصص تغذیه دکتر کریمی",
    slug: "nutrition-dr",
    email: "nutrition@diet.ir",
    phone: "۰۹۱۷۸۹۰۱۲۳۴",
    logoUrl: null,
    subscriptionStatus: "ACTIVE",
    planType: "ONE_YEAR",
    subscriptionEnd: "۱۴۰۵/۰۳/۱۰",
    totalBookings: 634,
    revenue: 98000000,
  },
  {
    id: "4",
    businessName: "آتلیه عکاسی نور",
    slug: "noor-studio",
    email: "noor@studio.ir",
    phone: "۰۹۱۴۵۶۷۸۹۰۱",
    logoUrl: null,
    subscriptionStatus: "EXPIRED",
    planType: "ONE_MONTH",
    subscriptionEnd: "۱۴۰۳/۰۵/۰۱",
    totalBookings: 312,
    revenue: 45000000,
  },
  {
    id: "5",
    businessName: "باشگاه بدنسازی فیت‌کلاب",
    slug: "fitclub",
    email: "info@fitclub.ir",
    phone: "۰۹۱۵۶۷۸۹۰۱۲",
    logoUrl: null,
    subscriptionStatus: "ACTIVE",
    planType: "THREE_MONTHS",
    subscriptionEnd: "۱۴۰۳/۱۱/۱۵",
    totalBookings: 2100,
    revenue: 320000000,
  },
  {
    id: "6",
    businessName: "مرکز آموزشی موفق",
    slug: "success-edu",
    email: "admin@success.ir",
    phone: "۰۹۱۶۷۸۹۰۱۲۳",
    logoUrl: null,
    subscriptionStatus: "EXPIRING_SOON",
    planType: "ONE_MONTH",
    subscriptionEnd: "۱۴۰۳/۰۷/۳۰",
    totalBookings: 540,
    revenue: 67000000,
  },
];

const PLAN_LABELS: Record<PlanType, string> = {
  ONE_MONTH: "۱ ماهه",
  THREE_MONTHS: "۳ ماهه",
  ONE_YEAR: "سالانه",
};

const STATUS_CONFIG: Record<SubscriptionStatus, { label: string; variant: "success" | "warning" | "error" }> = {
  ACTIVE: { label: "فعال", variant: "success" },
  EXPIRING_SOON: { label: "در حال انقضا", variant: "warning" },
  EXPIRED: { label: "منقضی شده", variant: "error" },
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
};

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | SubscriptionStatus>("ALL");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [extendPlan, setExtendPlan] = useState<PlanType>("ONE_MONTH");
  const [overrideStatus, setOverrideStatus] = useState<SubscriptionStatus | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesSearch =
        tenant.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || tenant.subscriptionStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tenants, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalBusinesses = tenants.length;
    const activeSubscriptions = tenants.filter((t) => t.subscriptionStatus === "ACTIVE").length;
    const expiredSubscriptions = tenants.filter((t) => t.subscriptionStatus === "EXPIRED").length;
    const totalBookings = tenants.reduce((sum, t) => sum + t.totalBookings, 0);
    const totalRevenue = tenants.reduce((sum, t) => sum + t.revenue, 0);

    return [
      {
        label: "کل کسب‌وکارها",
        value: totalBusinesses.toString(),
        icon: <Building2 className="w-5 h-5" />,
        color: "purple",
        change: "+۱۲٪",
      },
      {
        label: "اشتراک‌های فعال",
        value: `${activeSubscriptions} / ${totalBusinesses}`,
        icon: <CalendarCheck className="w-5 h-5" />,
        color: "emerald",
        change: `${Math.round((activeSubscriptions / totalBusinesses) * 100)}٪`,
      },
      {
        label: "کل رزروها",
        value: new Intl.NumberFormat("fa-IR").format(totalBookings),
        icon: <TrendingUp className="w-5 h-5" />,
        color: "cyan",
        change: "+۸٪",
      },
      {
        label: "درآمد پلتفرم",
        value: formatCurrency(totalRevenue),
        icon: <DollarSign className="w-5 h-5" />,
        color: "amber",
        change: "+۱۵٪",
      },
    ];
  }, [tenants]);

  const openSubscriptionModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setExtendPlan("ONE_MONTH");
    setOverrideStatus(null);
    setSubscriptionModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleExtendSubscription = () => {
    if (!selectedTenant) return;

    const now = new Date();
    let monthsToAdd = 1;
    if (extendPlan === "THREE_MONTHS") monthsToAdd = 3;
    if (extendPlan === "ONE_YEAR") monthsToAdd = 12;

    const newDate = new Date(now);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);
    const formattedDate = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(newDate);

    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant.id
          ? {
              ...t,
              subscriptionStatus: "ACTIVE" as SubscriptionStatus,
              planType: extendPlan,
              subscriptionEnd: formattedDate,
            }
          : t
      )
    );

    setSubscriptionModalOpen(false);
    setSelectedTenant(null);
  };

  const handleOverrideStatus = () => {
    if (!selectedTenant || !overrideStatus) return;

    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant.id ? { ...t, subscriptionStatus: overrideStatus } : t
      )
    );

    setSubscriptionModalOpen(false);
    setSelectedTenant(null);
    setOverrideStatus(null);
  };

  const getBadgeVariant = (status: SubscriptionStatus): "success" | "warning" | "error" => {
    return STATUS_CONFIG[status].variant;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15] text-white space-y-8 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              داشبورد مدیریت کل
            </h1>
            <p className="text-slate-400 mt-1">مدیریت کسب‌وکارها، اشتراک‌ها و تحلیل پلتفرم</p>
          </div>
          <Badge variant="neon">Super Admin</Badge>
        </div>

        {/* Metrics Cards */}
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
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {stat.icon}
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {stat.value}
                </p>
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
                placeholder="جستجو با نام کسب‌وکار، اسلاگ یا ایمیل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              {(["ALL", "ACTIVE", "EXPIRING_SOON", "EXPIRED"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === status
                      ? status === "ALL"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : status === "EXPIRING_SOON"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                      : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {status === "ALL"
                    ? "همه"
                    : status === "ACTIVE"
                    ? "فعال"
                    : status === "EXPIRING_SOON"
                    ? "در حال انقضا"
                    : "منقضی شده"}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Tenants Table */}
        <GlassCard className="overflow-hidden">
          {filteredTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Building2 className="w-12 h-12 mb-4 opacity-50" />
              <p>هیچ کسب‌وکاری یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">کسب‌وکار</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">رزرو</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">لینک رزرو</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">وضعیت اشتراک</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">پلان / انقضا</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant, index) => (
                    <motion.tr
                      key={tenant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={tenant.businessName} size="sm" />
                          <div>
                            <p className="font-medium text-slate-200">{tenant.businessName}</p>
                            <p className="text-xs text-slate-400">{tenant.email}</p>
                            <p className="text-xs text-slate-500">{tenant.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">
                        {new Intl.NumberFormat("fa-IR").format(tenant.totalBookings)}
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={`/booking/${tenant.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                        >
                          /{tenant.slug}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getBadgeVariant(tenant.subscriptionStatus)}>
                          {STATUS_CONFIG[tenant.subscriptionStatus].label}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">
                        <div>
                          <p>{PLAN_LABELS[tenant.planType]}</p>
                          <p className="text-xs text-slate-500">تا {tenant.subscriptionEnd}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === tenant.id ? null : tenant.id)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-400" />
                          </button>
                          <AnimatePresence>
                            {actionMenuOpen === tenant.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute left-0 top-full mt-1 w-48 bg-[#13141f] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden"
                              >
                                <button
                                  onClick={() => openSubscriptionModal(tenant)}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors"
                                >
                                  <Settings className="w-4 h-4" />
                                  مدیریت اشتراک
                                </button>
                                <button
                                  onClick={() => {
                                    window.open(`/dashboard/${tenant.slug}`, "_blank");
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors"
                                >
                                  <BarChart3 className="w-4 h-4" />
                                  مشاهده تحلیل‌ها
                                </button>
                                <button
                                  onClick={() => {
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-pink-400 hover:bg-white/5 transition-colors"
                                >
                                  <Ban className="w-4 h-4" />
                                  مسدود کردن
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
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

      {/* Subscription Control Modal */}
      <AnimatePresence>
        {subscriptionModalOpen && selectedTenant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSubscriptionModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <GlassCard className="p-6 sm:p-8">
                <button
                  onClick={() => setSubscriptionModalOpen(false)}
                  className="absolute top-4 left-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    مدیریت اشتراک
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {selectedTenant.businessName}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      تمدید اشتراک
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "ONE_MONTH", label: "۱ ماه" },
                        { value: "THREE_MONTHS", label: "۳ ماه" },
                        { value: "ONE_YEAR", label: "۱ سال" },
                      ].map((plan) => (
                        <button
                          key={plan.value}
                          onClick={() => setExtendPlan(plan.value as PlanType)}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                            extendPlan === plan.value
                              ? "border-purple-500 bg-purple-500/10 text-purple-300"
                              : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          {plan.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      تغییر وضعیت اشتراک
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "ACTIVE", label: "فعال", color: "emerald" },
                        { value: "EXPIRING_SOON", label: "در حال انقضا", color: "amber" },
                        { value: "EXPIRED", label: "منقضی شده", color: "pink" },
                      ].map((status) => (
                        <button
                          key={status.value}
                          onClick={() => setOverrideStatus(status.value as SubscriptionStatus)}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                            overrideStatus === status.value
                              ? status.color === "emerald"
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                                : status.color === "amber"
                                ? "border-amber-500 bg-amber-500/10 text-amber-300"
                                : "border-pink-500 bg-pink-500/10 text-pink-300"
                              : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSubscriptionModalOpen(false)}
                      className="flex-1"
                    >
                      انصراف
                    </Button>
                    <Button onClick={handleExtendSubscription} className="flex-1">
                      تمدید اشتراک
                    </Button>
                  </div>

                  {overrideStatus && overrideStatus !== selectedTenant.subscriptionStatus && (
                    <div className="pt-4 border-t border-white/10">
                      <Button
                        onClick={handleOverrideStatus}
                        variant="secondary"
                        className="w-full"
                      >
                        اعمال تغییر وضعیت به {STATUS_CONFIG[overrideStatus].label}
                      </Button>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
