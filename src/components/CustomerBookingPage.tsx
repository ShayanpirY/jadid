"use client";

import React, { useState } from "react";
import { Calendar, Clock, User, Phone, ShieldCheck, CheckCircle2, CreditCard, ChevronLeft, IdCard } from "lucide-react";

export default function CustomerBookingPage() {
  const [selectedDate, setSelectedDate] = useState("۱۴۰۵/۰۵/۱۵");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const bookingFee = "۲۵۰,۰۰۰ تومان";

  const timeSlots = [
    { time: "09:00 - 09:45", available: true },
    { time: "10:00 - 10:45", available: true },
    { time: "11:00 - 11:45", available: false },
    { time: "16:00 - 16:45", available: true },
    { time: "17:00 - 17:45", available: true },
  ];

  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      alert("لطفاً یک زمان برای رزرو انتخاب کنید.");
      return;
    }
    if (nationalId.length !== 10) {
      alert("لطفاً کد ملی ۱۰ رقمی معتبر وارد کنید.");
      return;
    }
    setIsPaymentStep(true);
  };

  const handleFinalPayment = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 md:p-10" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-fuchsia-600/20">
              ش‌پ
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">دکتر شایان پیریایی</h1>
              <p className="text-xs text-slate-400 mt-0.5">دریافت نوبت و رزرو آنلاین</p>
            </div>
          </div>
          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            نوبت‌دهی فعال
          </span>
        </div>

        {!isPaymentStep && !isSubmitted && (
          <form onSubmit={handleGoToPayment} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Calendar size={18} className="text-fuchsia-400" />
                انتخاب روز رزرو
              </label>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {["امروز (۱۵ مرداد)", "فردا (۱۶ مرداد)", "پس‌فردا (۱۷ مرداد)"].map((day, idx) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={`px-4 py-3 rounded-2xl text-xs font-medium whitespace-nowrap transition-all border ${
                      idx === 0
                        ? "bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/20"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Clock size={18} className="text-fuchsia-400" />
                انتخاب ساعت نوبت
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-3 px-3 rounded-xl text-xs font-mono transition-all border flex flex-col items-center justify-center gap-1 ${
                      !slot.available
                        ? "bg-slate-950/50 border-slate-800/40 text-slate-600 cursor-not-allowed line-through"
                        : selectedTime === slot.time
                        ? "bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/30 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-fuchsia-500/50"
                    }`}
                    dir="ltr"
                  >
                    <span>{slot.time}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <User size={18} className="text-fuchsia-400" />
                اطلاعات احراز هویت نوبت‌گیرنده
              </label>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علی محمدی"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">کد ملی (جهت جلوگیری از رزرو غیرواقعی)</label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={10}
                        required
                        placeholder="0012345678"
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:outline-none transition-all font-mono"
                        dir="ltr"
                      />
                      <IdCard size={18} className="absolute left-3 top-3.5 text-slate-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">شماره همراه</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="09123456789"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-fuchsia-500 focus:outline-none transition-all font-mono"
                        dir="ltr"
                      />
                      <Phone size={18} className="absolute left-3 top-3.5 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-fuchsia-600/25 text-sm flex items-center justify-center gap-2"
            >
              تایید و ورود به درگاه پرداخت
              <ChevronLeft size={18} />
            </button>
          </form>
        )}

        {isPaymentStep && !isSubmitted && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="text-fuchsia-400" size={20} />
                پیش‌فاکتور و پیش‌پرداخت رزرو
              </h2>
              <p className="text-xs text-slate-400 mt-1">جهت قطعی شدن رزرو، مبلغ بیعانه/ویزیت را پرداخت کنید.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>نام مراجعه‌کننده:</span>
                <span className="text-white font-medium">{patientName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>کد ملی:</span>
                <span className="text-white font-mono">{nationalId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>زمان نوبت:</span>
                <span className="text-fuchsia-400 font-mono" dir="ltr">{selectedTime} ({selectedDate})</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-white">مبلغ قابل پرداخت:</span>
                <span className="font-bold text-emerald-400 text-base">{bookingFee}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPaymentStep(false)}
                className="w-1/3 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-medium py-3 rounded-xl transition-all text-xs"
              >
                ویرایش اطلاعات
              </button>
              
              <button
                type="button"
                onClick={handleFinalPayment}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center gap-2"
              >
                پرداخت آنلاین و ثبت قطعی
                <ShieldCheck size={18} />
              </button>
            </div>
          </div>
        )}

        {isSubmitted && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">پرداخت موفق! نوبت شما قطعی شد.</h2>
              <p className="text-xs text-slate-400">کد پیگیری پرداخت و اطلاعات نوبت برای شماره {patientPhone} پیامک شد.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-slate-300 text-right">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">کد ملی:</span>
                <span className="font-mono text-white">{nationalId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">ساعت نوبت:</span>
                <span className="font-mono text-fuchsia-400" dir="ltr">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">وضعیت پرداخت:</span>
                <span className="text-emerald-400 font-bold">پرداخت شده ({bookingFee})</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
