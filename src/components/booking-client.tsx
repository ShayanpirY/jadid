"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JalaliCalendar } from "@/components/ui/jalali-calendar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { cn, generateTimeSlots, getTodayJalali, JALALI_MONTHS } from "@/lib/utils";
import type { Provider, Service } from "@/types";

const bookingSchema = z.object({
  customerName: z.string().min(2, "نام و نام خانوادگی را وارد کنید"),
  customerPhone: z.string().regex(/^09\d{9}$/, "شماره تماس باید با 09 شروع شود و 11 رقم باشد"),
  serviceId: z.string().min(1, "خدمت را انتخاب کنید"),
  date: z.string().min(1, "تاریخ را انتخاب کنید"),
  time: z.string().min(1, "ساعت را انتخاب کنید"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingClientProps {
  provider: Provider;
  services: Service[];
}

export default function BookingClient({ provider, services }: BookingClientProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(services[0] || null);
  const [selectedDate, setSelectedDate] = useState<{ jy: number; jm: number; jd: number } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const brandColor = provider.brandColor || "#a855f7";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: services[0]?.id || "",
      date: "",
      time: "",
      customerName: "",
      customerPhone: "",
      notes: "",
    },
  });

  const availableSlots = useMemo(() => {
    if (!selectedService) return [];
    return generateTimeSlots("08:00", "20:00", selectedService.durationMinutes);
  }, [selectedService]);

  const today = getTodayJalali();

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("خطا در ثبت رزرو");

      setSubmitSuccess(true);
      reset();
      setSelectedTime(null);
      setSelectedDate(null);
      setStep(1);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15]">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d0e15]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30"
                style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)` }}
              >
                {provider.businessName.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {provider.businessName}
                </h1>
                <p className="text-xs text-slate-400">پلتفرم رزرو آنلاین</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="neon" className="hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1.5 animate-pulse" />
                فعال
              </Badge>
              <Avatar name={provider.businessName} size="sm" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm text-purple-300">رزرو آنلاین ۲۴/۷</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-3">
            رزرو نوبت آنلاین
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            برای دریافت نوبت، مراحل زیر را تکرار کنید
          </p>

          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                    step >= s
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40"
                      : "bg-slate-800 text-slate-500"
                  )}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={cn(
                      "w-12 h-1 rounded-full transition-all duration-300",
                      step > s ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-slate-800"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <GlassCard className="p-6 sm:p-8 glow">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-1">
                        انتخاب خدمت
                      </h2>
                      <p className="text-sm text-slate-400">خدمت مورد نظر خود را انتخاب کنید</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <motion.button
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedService(service);
                          }}
                          className={cn(
                            "p-5 rounded-2xl border-2 text-right transition-all duration-300",
                            selectedService?.id === service.id
                              ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                              : "border-white/10 bg-white/5 hover:border-purple-500/50"
                          )}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-slate-200">{service.title}</h3>
                              {service.description && (
                                <p className="text-sm text-slate-400 mt-1">{service.description}</p>
                              )}
                            </div>
                            {selectedService?.id === service.id && (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-400">
                              <span className="font-bold text-cyan-400">{service.durationMinutes}</span> دقیقه
                            </span>
                            <span className="text-slate-600">|</span>
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                              {service.price.toLocaleString("fa-IR")} تومان
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setStep(2)}
                        disabled={!selectedService}
                        className="min-w-[140px]"
                      >
                        ادامه
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-1">
                        انتخاب تاریخ و ساعت
                      </h2>
                      <p className="text-sm text-slate-400">تاریخ و ساعت مورد نظر خود را انتخاب کنید</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                        <JalaliCalendar
                          selectedDate={selectedDate || undefined}
                          onSelectDate={(date) => {
                            setSelectedDate(date);
                          }}
                          minDate={today}
                          bookedDates={[]}
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            ساعت‌های خالی
                          </h3>
                          {selectedDate ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {availableSlots.map((time) => (
                                <motion.button
                                  key={time}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setSelectedTime(time)}
                                  className={cn(
                                    "py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                    selectedTime === time
                                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40"
                                      : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                                  )}
                                >
                                  {time}
                                </motion.button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-500 text-sm bg-white/5 rounded-2xl border border-white/10">
                              لطفاً ابتدا تاریخ را انتخاب کنید
                            </div>
                          )}
                        </div>

                        {selectedDate && (
                          <div className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/30">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">تاریخ انتخاب شده</p>
                                <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                                  {selectedDate.jd} {JALALI_MONTHS[selectedDate.jm - 1]} {selectedDate.jy}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={() => setStep(1)}>
                        بازگشت
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!selectedDate || !selectedTime}
                        className="min-w-[140px]"
                      >
                        ادامه
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-1">
                        اطلاعات تماس
                      </h2>
                      <p className="text-sm text-slate-400">برای تکمیل رزرو، اطلاعات خود را وارد کنید</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                          <span className="font-medium text-slate-200">{selectedService?.title}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">مدت زمان</span>
                          <span className="font-medium text-slate-200">{selectedService?.durationMinutes} دقیقه</span>
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
                              {selectedService?.price.toLocaleString("fa-IR")}
                              <span className="text-sm font-normal text-slate-400 mr-1">تومان</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setStep(2)} type="button">
                          بازگشت
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="min-w-[160px]">
                          {isSubmitting ? "در حال ثبت..." : "تایید و ثبت رزرو"}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="success"
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
                <p className="text-slate-400 mb-8">
                  کد رزرو شما: <span className="font-mono font-bold text-purple-400">#{Math.random().toString(36).slice(2, 8).toUpperCase()}</span>
                </p>
                <Button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setStep(1);
                  }}
                  className="w-full"
                >
                  رزرو جدید
                </Button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-8 text-center border-t border-white/10">
        <p className="text-sm text-slate-500">
           © {new Date().getFullYear()} {provider.businessName} - تمامی حقوق محفوظ است
        </p>
      </footer>
    </div>
  );
}
