"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { JalaliCalendar } from "@/components/ui/jalali-calendar";
import { cn, generateTimeSlots, getTodayJalali, JALALI_MONTHS } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import BookingDemoModal from "@/components/BookingDemoModal";

type ViewMode = "client" | "provider";
type BookingState = "normal" | "fully_booked" | "expired";
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const PROVIDERS = [
  {
    id: "dr-maryam",
    name: "دکتر مریم زمانی",
    specialty: "متخصص پوست و زیبایی",
    experience: "۱۲ سال سابقه",
    rating: 4.9,
    reviews: 234,
    color: "#a855f7",
    workingHours: "شنبه تا پنج‌شنبه، ۹ تا ۱۸",
    avatar: "م",
  },
  {
    id: "royal-salon",
    name: "سالن زیبایی رویال",
    specialty: "آرایشگاه و مرکز زیبایی",
    experience: "۸ سال سابقه",
    rating: 4.7,
    reviews: 189,
    color: "#f472b6",
    workingHours: "شنبه تا چهارشنبه، ۱۰ تا ۲۰",
    avatar: "ر",
  },
];

const SERVICES: Record<string, { id: string; title: string; durationMinutes: number; price: number; description: string }[]> = {
  "dr-maryam": [
    { id: "s1", title: "مشاوره پوستی", durationMinutes: 30, price: 250000, description: "بررسی کامل پوست و درمان‌های پیشنهادی" },
    { id: "s2", title: "جلسه لیزر", durationMinutes: 45, price: 400000, description: "جلسه لیزر صورت یا بدن" },
    { id: "s3", title: "ورمی‌پلاسی لیپو", durationMinutes: 60, price: 600000, description: "تسریع چربی‌سوزی با مزوتراپی" },
  ],
  "royal-salon": [
    { id: "s4", title: "اصلاح و استایل مو", durationMinutes: 45, price: 180000, description: "شامپو، اصلاح و استایل حرفه‌ای" },
    { id: "s5", title: "رنگ مو و هیلایت", durationMinutes: 90, price: 550000, description: "رنگ مو با برندهای مطرح" },
    { id: "s6", title: "فیشیال و ماساژ", durationMinutes: 60, price: 320000, description: "فیشیال solvents و ماساژ صورت" },
  ],
};

const bookingSchema = z.object({
  customerName: z.string().min(2, "نام و نام خانوادگی را وارد کنید"),
  customerPhone: z.string().regex(/^09\d{9}$/, "شماره تماس باید با 09 شروع شود و 11 رقم باشد"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function DemoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("client");
  const [bookingState, setBookingState] = useState<BookingState>("normal");
  const [step, setStep] = useState<Step>(1);
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0]);
  const [selectedService, setSelectedService] = useState(SERVICES[PROVIDERS[0].id][0]);
  const [selectedDate, setSelectedDate] = useState<{ jy: number; jm: number; jd: number } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const today = getTodayJalali();
  const availableSlots = useMemo(() => {
    if (!selectedService) return [];
    return generateTimeSlots("08:00", "20:00", selectedService.durationMinutes);
  }, [selectedService]);

  const isExpired = bookingState === "expired";
  const isFullyBooked = bookingState === "fully_booked";

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://nobatdahi.ir/${selectedProvider.id}`);
    showToast("✅ لینک کپی شد!");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onPhoneSubmit = async (data: BookingFormData) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setTrackingCode(`NB-${Date.now().toString(36).toUpperCase()}`);
    setBookingComplete(true);
    setIsProcessing(false);
    showToast("✅ رزرو با موفقیت ثبت شد!");
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedService(SERVICES[selectedProvider.id][0]);
    setSelectedDate(null);
    setSelectedTime(null);
    setPaymentMethod("online");
    setBookingComplete(false);
    setTrackingCode("");
    reset();
  };

  const switchProvider = (providerId: string) => {
    const provider = PROVIDERS.find((p) => p.id === providerId)!;
    setSelectedProvider(provider);
    setSelectedService(SERVICES[providerId][0]);
    resetBooking();
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15]">
      {/* Top Controls */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d0e15]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 h-auto py-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                دمو نوبتی
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Perspective Toggle */}
              <div className="bg-white/5 rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setViewMode("client")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    viewMode === "client"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  👤 مشتری
                </button>
                <button
                  onClick={() => setViewMode("provider")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    viewMode === "provider"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  🏢 مدیر
                </button>
              </div>

              {/* State Simulator */}
              <div className="bg-white/5 rounded-xl p-1 border border-white/10">
                {[
                  { key: "normal", label: "✅ Normal", color: "emerald" },
                  { key: "fully_booked", label: "⚠️ Fully Booked", color: "amber" },
                  { key: "expired", label: "⛔ Expired", color: "pink" },
                ].map((state) => (
                  <button
                    key={state.key}
                    onClick={() => setBookingState(state.key as BookingState)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 border",
                      bookingState === state.key
                        ? state.key === "normal"
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                          : state.key === "fully_booked"
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                          : "bg-pink-500/20 border-pink-500/50 text-pink-400"
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                    )}
                  >
                    {state.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setDemoModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
            دموی رزرو سریع
          </Button>
        </div>
        <AnimatePresence mode="wait">
          {viewMode === "client" ? (
            <motion.div
              key="client"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Step 1: Provider Selection */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                      انتخاب ارائه‌دهنده
                    </h2>
                    <p className="text-slate-400">ارائه‌دهنده مورد نظر خود را انتخاب کنید</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PROVIDERS.map((provider) => (
                      <motion.button
                        key={provider.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => switchProvider(provider.id)}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-right transition-all duration-300",
                          selectedProvider.id === provider.id
                            ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                            : "border-white/10 bg-white/5 hover:border-purple-500/50"
                        )}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar name={provider.name} size="lg" />
                          <div>
                            <h3 className="text-xl font-bold text-slate-200">{provider.name}</h3>
                            <p className="text-sm text-slate-400">{provider.specialty}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-amber-400">⭐ {provider.rating}</span>
                          <span className="text-slate-500">({provider.reviews} نظر)</span>
                          <span className="text-slate-400">🕒 {provider.workingHours}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)}>ادامه</Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Service Selection */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                      انتخاب خدمت
                    </h2>
                    <p className="text-slate-400">خدمت مورد نظر خود را انتخاب کنید</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SERVICES[selectedProvider.id].map((service) => (
                      <motion.button
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedService(service)}
                        className={cn(
                          "p-5 rounded-2xl border-2 text-right transition-all duration-300",
                          selectedService.id === service.id
                            ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                            : "border-white/10 bg-white/5 hover:border-purple-500/50"
                        )}
                      >
                        <h4 className="font-bold text-slate-200 mb-2">{service.title}</h4>
                        <p className="text-sm text-slate-400 mb-3">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">{service.durationMinutes} دقیقه</span>
                          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            {service.price.toLocaleString("fa-IR")} تومان
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      بازگشت
                    </Button>
                    <Button onClick={() => setStep(3)} disabled={!selectedService}>
                      ادامه
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Calendar & Time Slots */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                      انتخاب تاریخ و ساعت
                    </h2>
                    <p className="text-slate-400">تاریخ و ساعت مورد نظر را انتخاب کنید</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                      <JalaliCalendar
                        selectedDate={selectedDate || undefined}
                        onSelectDate={setSelectedDate}
                        minDate={today}
                        bookedDates={isFullyBooked ? Array.from({ length: 30 }, (_, i) => `${today.jy}/${today.jm}/${i + 1}`) : []}
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                        ساعت‌های خالی
                      </h3>
                      {selectedDate ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {isFullyBooked ? (
                            <p className="text-slate-500 col-span-full text-center py-4">
                              تمام slot‌ها در این تاریخ پر هستند
                            </p>
                          ) : (
                            availableSlots.map((time) => {
                              const hour = parseInt(time.split(":")[0]);
                              const bucket = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
                              const isSelected = selectedTime === time;
                              return (
                                <motion.button
                                  key={time}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setSelectedTime(time)}
                                  className={cn(
                                    "py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                                    isSelected
                                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40 border-purple-500"
                                      : bucket === "morning"
                                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                                      : bucket === "afternoon"
                                      ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20"
                                      : "bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20"
                                  )}
                                >
                                  {time}
                                </motion.button>
                              );
                            })
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-8">لطفاً ابتدا تاریخ را انتخاب کنید</p>
                      )}
                      {selectedDate && (
                        <div className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/30">
                          <p className="text-sm text-slate-400">تاریخ انتخاب شده</p>
                          <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                            {selectedDate.jd} {JALALI_MONTHS[selectedDate.jm - 1]} {selectedDate.jy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(2)}>
                      بازگشت
                    </Button>
                    <Button onClick={() => setStep(4)} disabled={!selectedDate || !selectedTime || isFullyBooked}>
                      ادامه
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Customer Info Form */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                      اطلاعات تماس
                    </h2>
                    <p className="text-slate-400">برای تکمیل رزرو، اطلاعات خود را وارد کنید</p>
                  </div>
                  <GlassCard className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit(onPhoneSubmit)} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <Label required>نام و نام خانوادگی</Label>
                          <Input
                            {...register("customerName")}
                            placeholder="مثال: علی محمدی"
                            error={errors.customerName?.message}
                          />
                        </div>
                        <div>
                          <Label required>شماره تماس</Label>
                          <Input
                            {...register("customerPhone")}
                            placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                            error={errors.customerPhone?.message}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>توضیحات اختیاری</Label>
                        <textarea
                          {...register("notes")}
                          placeholder="در صورت نیاز، توضیحات خود را بنویسید..."
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                        <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">خلاصه رزرو</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">خدمت</span>
                          <span className="font-medium text-slate-200">{selectedService.title}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">مدت زمان</span>
                          <span className="font-medium text-slate-200">{selectedService.durationMinutes} دقیقه</span>
                        </div>
                        {selectedDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">تاریخ</span>
                            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                              {selectedDate.jd} {JALALI_MONTHS[selectedDate.jm - 1]} {selectedDate.jy}
                            </span>
                          </div>
                        )}
                        {selectedTime && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">ساعت</span>
                            <span className="font-medium text-slate-200">{selectedTime}</span>
                          </div>
                        )}
                        <div className="border-t border-white/10 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">مبلغ قابل پرداخت</span>
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                              {selectedService.price.toLocaleString("fa-IR")}
                              <span className="text-sm font-normal text-slate-400 mr-1">تومان</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setStep(3)} type="button">
                          بازگشت
                        </Button>
                        <Button type="submit" disabled={isProcessing} className="min-w-[160px]">
                          {isProcessing ? "در حال ثبت..." : "تایید و ثبت رزرو"}
                        </Button>
                      </div>
                    </form>
                  </GlassCard>
                </motion.div>
              )}

              {/* Step 5: Payment */}
              {step === 5 && !bookingComplete && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                      انتخاب روش پرداخت
                    </h2>
                    <p className="text-slate-400">روش پرداخت خود را انتخاب کنید</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: "online", label: "پرداخت بیعانه آنلاین", desc: "زرین‌پال / سامان", icon: "💳" },
                      { key: "cash", label: "پرداخت در محل", desc: "پرداخت در وقت ویزیت", icon: "💵" },
                    ].map((method) => (
                      <motion.button
                        key={method.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod(method.key as "online" | "cash")}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-right transition-all duration-300",
                          paymentMethod === method.key
                            ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                            : "border-white/10 bg-white/5 hover:border-purple-500/50"
                        )}
                      >
                        <div className="text-3xl mb-3">{method.icon}</div>
                        <h4 className="font-bold text-slate-200 mb-1">{method.label}</h4>
                        <p className="text-sm text-slate-400">{method.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(4)}>
                      بازگشت
                    </Button>
                    <Button onClick={() => setStep(6)} className="min-w-[160px]">
                      پرداخت و ثبت نهایی
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Confirmation & Ticket */}
              {step === 6 && bookingComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-lg mx-auto text-center"
                >
                  <GlassCard className="p-8 sm:p-12 glow">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
                    >
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-3">
                      رزرو شما با موفقیت ثبت شد!
                    </h2>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6 text-right">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">کد پیگیری</span>
                          <span className="font-mono font-bold text-purple-400">{trackingCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ارائه‌دهنده</span>
                          <span className="font-medium text-slate-200">{selectedProvider.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">خدمت</span>
                          <span className="font-medium text-slate-200">{selectedService.title}</span>
                        </div>
                        {selectedDate && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">تاریخ</span>
                            <span className="font-medium text-cyan-400">
                              {selectedDate.jd} {JALALI_MONTHS[selectedDate.jm - 1]} {selectedDate.jy}
                            </span>
                          </div>
                        )}
                        {selectedTime && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">ساعت</span>
                            <span className="font-medium text-pink-400">{selectedTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500/10">
                        📅 افزودن به تقویم
                      </Button>
                      <Button onClick={resetBooking} className="flex-1">
                        رزرو جدید
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Provider View */
            <motion.div
              key="provider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Provider Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "رزروهای امروز", value: isExpired ? "۰" : "۱۲", icon: "📅", color: "purple" },
                  { label: "درآمد این ماه", value: isExpired ? "۰" : "۸,۵۰۰,۰۰۰", icon: "💰", color: "cyan" },
                  { label: "مشتریان فعال", value: isExpired ? "۰" : "۴۵", icon: "👥", color: "pink" },
                  { label: "وضعیت اشتراک", value: isExpired ? "منقضی" : "فعال", icon: "⭐", color: isExpired ? "pink" : "emerald" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className="p-6" hover>
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <p className="text-slate-400 text-sm">{stat.label}</p>
                      <p className={cn(
                        "text-2xl font-bold",
                        stat.color === "purple" && "text-purple-400",
                        stat.color === "cyan" && "text-cyan-400",
                        stat.color === "pink" && "text-pink-400",
                        stat.color === "emerald" && "text-emerald-400"
                      )}>{stat.value}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Share Link Widget */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
                  لینک رزرو اختصاصی
                </h3>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={`https://nobatdahi.ir/${selectedProvider.id}`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm"
                  />
                  <Button onClick={copyLink}>کپی لینک</Button>
                </div>
              </GlassCard>

              {/* Recent Bookings */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
                  رزروهای اخیر
                </h3>
                {isExpired ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⛔</div>
                    <h3 className="text-2xl font-bold text-pink-400 mb-2">اشتراک منقضی شده</h3>
                    <p className="text-slate-400 mb-6">برای دریافت رزرو، لطفاً اشتراک خود را تمدید کنید.</p>
                    <Button variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500/10">
                      تمدید اشتراک
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { name: "علی محمدی", service: selectedService.title, time: "۱۴:۰۰", date: "۲۸ تیر" },
                      { name: "مریم رضایی", service: selectedService.title, time: "۱۰:۳۰", date: "۲۹ تیر" },
                      { name: "رضا کریمی", service: selectedService.title, time: "۱۶:۰۰", date: "۳۰ تیر" },
                    ].map((booking, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar name={booking.name} size="sm" />
                          <div>
                            <p className="font-medium text-slate-200">{booking.name}</p>
                            <p className="text-sm text-slate-400">{booking.service}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-cyan-400">{booking.time}</p>
                          <p className="text-xs text-slate-500">{booking.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50"
          >
            <GlassCard className="p-4 border-purple-500/30 shadow-lg shadow-purple-500/20">
              <p className="text-sm text-slate-200">{toast}</p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}
