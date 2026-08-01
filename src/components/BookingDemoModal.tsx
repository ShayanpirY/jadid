"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { X, User, Phone, CreditCard, CheckCircle, Calendar, Clock, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatJalaliDate } from "@/lib/utils";

type BookingStep = 1 | 2 | 3 | 4;

interface BookingDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const infoSchema = z.object({
  customerName: z.string().min(2, "نام و نام خانوادگی را وارد کنید"),
  customerPhone: z.string().regex(/^09\d{9}$/, "شماره تماس باید با 09 شروع شود و ۱۱ رقم باشد"),
});

type InfoFormData = z.infer<typeof infoSchema>;

const DEMO_PROVIDERS = [
  {
    id: "dr-maryam",
    name: "دکتر مریم زمانی",
    specialty: "متخصص پوست و زیبایی",
    color: "#a855f7",
    avatar: "م",
  },
];

const DEMO_SERVICES = [
  { id: "demo-s1", title: "مشاوره پوستی", durationMinutes: 30, price: 350000, description: "بررسی کامل پوست و درمان‌های پیشنهادی" },
];

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
};

const generateTrackingCode = () => {
  return `#NOBA-${Math.floor(1000 + Math.random() * 9000)}`;
};

export default function BookingDemoModal({ isOpen, onClose }: BookingDemoModalProps) {
  const [step, setStep] = useState<BookingStep>(1);
  const [selectedProvider, setSelectedProvider] = useState(DEMO_PROVIDERS[0]);
  const [selectedService, setSelectedService] = useState(DEMO_SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema),
  });

  const handleInfoSubmit = async (data: InfoFormData) => {
    setStep(3);
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    await new Promise((r) => setTimeout(r, 1500));
    const code = generateTrackingCode();
    setTrackingCode(code);
    setIsProcessingPayment(false);
    setIsComplete(true);
    setStep(4);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setIsComplete(false);
    setTrackingCode("");
    reset();
  };

  const downloadReceipt = () => {
    const receipt = `
نوبت رو - رسید رزرو
========================
کد پیگیری: ${trackingCode}
ارائه‌دهنده: ${selectedProvider.name}
سرویس: ${selectedService.title}
تاریخ: ${selectedDate}
ساعت: ${selectedTime}
مبلغ: ${formatPrice(selectedService.price)}
وضعیت: پرداخت شده (رزرو قطعی)
========================
    `.trim();
    const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nobat-ro-${trackingCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="p-6 sm:p-8">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              {!isComplete ? (
                <>
                  {/* Progress */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            step >= s
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-white/10 text-slate-500"
                          }`}
                        >
                          {s}
                        </div>
                        {s < 3 && (
                          <div
                            className={`w-8 h-0.5 transition-all ${
                              step > s ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-white/10"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Selection */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                          انتخاب خدمات
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">ارائه‌دهنده، سرویس، تاریخ و ساعت را انتخاب کنید</p>
                      </div>

                      <div>
                        <Label>ارائه‌دهنده</Label>
                        <div className="mt-2 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                          <Avatar name={selectedProvider.name} className="w-10 h-10 text-sm" />
                          <div>
                            <p className="font-bold text-slate-200">{selectedProvider.name}</p>
                            <p className="text-xs text-slate-400">{selectedProvider.specialty}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>سرویس</Label>
                        <div className="mt-2 grid gap-2">
                          {DEMO_SERVICES.map((service) => (
                            <button
                              key={service.id}
                              onClick={() => setSelectedService(service)}
                              className={`p-4 rounded-xl border text-right transition-all ${
                                selectedService.id === service.id
                                  ? "border-purple-500 bg-purple-500/10"
                                  : "border-white/10 bg-white/5 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-bold text-slate-200">{service.title}</p>
                                  <p className="text-xs text-slate-400 mt-1">{service.description}</p>
                                  <p className="text-xs text-slate-500 mt-1">⏱ {service.durationMinutes} دقیقه</p>
                                </div>
                                <p className="text-sm font-bold text-purple-400">{formatPrice(service.price)}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>تاریخ</Label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="mt-2 w-full p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <Label>ساعت</Label>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                                selectedTime === time
                                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                  : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => setStep(2)}
                        disabled={!selectedDate || !selectedTime}
                        className="w-full"
                      >
                        ادامه
                        <ChevronLeft className="w-4 h-4 mr-2" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Step 2: User Info */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                          اطلاعات شما
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">برای تکمیل رزرو لطفاً اطلاعات خود را وارد کنید</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">ارائه‌دهنده:</span>
                          <span className="text-slate-200">{selectedProvider.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">سرویس:</span>
                          <span className="text-slate-200">{selectedService.title}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">تاریح:</span>
                          <span className="text-slate-200">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">ساعت:</span>
                          <span className="text-slate-200">{selectedTime}</span>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit(handleInfoSubmit)} className="space-y-4">
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
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            error={errors.customerPhone?.message}
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">
                            <ChevronRight className="w-4 h-4 ml-2" />
                            بازگشت
                          </Button>
                          <Button type="submit" className="flex-1">
                            ادامه به پرداخت
                            <ChevronLeft className="w-4 h-4 mr-2" />
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                          پرداخت و نهایی‌سازی
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">مبلغ را پرداخت کنید و نوبت خود را رزرو نمایید</p>
                      </div>

                      <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                        <div className="flex items-center gap-3 mb-4">
                          <CreditCard className="w-6 h-6 text-purple-400" />
                          <h3 className="font-bold text-slate-200">صورت‌حساب</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">سرویس:</span>
                            <span className="text-slate-200">{selectedService.title}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">تاریخ:</span>
                            <span className="text-slate-200">{selectedDate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">ساعت:</span>
                            <span className="text-slate-200">{selectedTime}</span>
                          </div>
                          <div className="border-t border-white/10 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="font-bold text-slate-200">مبلغ قابل پرداخت:</span>
                              <span className="font-bold text-purple-400">{formatPrice(selectedService.price)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button type="button" variant="ghost" onClick={() => setStep(2)} className="flex-1">
                          <ChevronRight className="w-4 h-4 ml-2" />
                          بازگشت
                        </Button>
                        <Button
                          onClick={handlePayment}
                          disabled={isProcessingPayment}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                          {isProcessingPayment ? (
                            <span className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              />
                              در حال پردازش...
                            </span>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4 ml-2" />
                              پرداخت آنلاین و نهایی‌سازی نوبت
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                /* Step 4: Confirmation */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-5"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                      نوبت شما با موفقیت ثبت و رزرو شد!
                    </h2>
                    <p className="text-sm text-slate-400">رسید رزرو برای شما آماده است</p>
                  </div>

                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">کد پیگیری:</span>
                      <Badge variant="neon">{trackingCode}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">ارائه‌دهنده:</span>
                      <span className="text-slate-200">{selectedProvider.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">سرویس:</span>
                      <span className="text-slate-200">{selectedService.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">تاریخ:</span>
                      <span className="text-slate-200">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">ساعت:</span>
                      <span className="text-slate-200">{selectedTime}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-200">وضعیت:</span>
                        <Badge variant="success">پرداخت شده (رزرو قطعی)</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={downloadReceipt} variant="outline" className="flex-1">
                      <Download className="w-4 h-4 ml-2" />
                      دانلود رسید
                    </Button>
                    <Button onClick={resetBooking} className="flex-1">
                      رزرو جدید
                    </Button>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
