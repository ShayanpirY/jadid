"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  gregorianToJalali,
  jalaliToGregorian,
  getJalaliMonthDays,
  JALALI_WEEKDAYS,
  JALALI_MONTHS,
  cn,
} from "@/lib/utils";

interface JalaliCalendarProps {
  selectedDate?: { jy: number; jm: number; jd: number };
  onSelectDate?: (date: { jy: number; jm: number; jd: number }) => void;
  minDate?: { jy: number; jm: number; jd: number };
  bookedDates?: string[];
}

export function JalaliCalendar({
  selectedDate,
  onSelectDate,
  minDate,
  bookedDates = [],
}: JalaliCalendarProps) {
  const today = useMemo(() => {
    const now = new Date();
    return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  const [viewMonth, setViewMonth] = useState(today.jm);
  const [viewYear, setViewYear] = useState(today.jy);

  const daysInMonth = getJalaliMonthDays(viewYear, viewMonth);
  const firstDayOfWeek = (() => {
    const g = jalaliToGregorian(viewYear, viewMonth, 1);
    const d = new Date(g.year, g.month - 1, g.day);
    let day = d.getDay();
    day = day === 6 ? 0 : day + 1;
    return day;
  })();

  const isPastDate = (jd: number) => {
    if (viewYear < today.jy) return true;
    if (viewYear === today.jy && viewMonth < today.jm) return true;
    if (viewYear === today.jy && viewMonth === today.jm && jd < today.jd) return true;
    return false;
  };

  const isBooked = (jd: number) => {
    const dateStr = `${viewYear}/${viewMonth}/${jd}`;
    return bookedDates.includes(dateStr);
  };

  const isSelected = (jd: number) => {
    if (!selectedDate) return false;
    return selectedDate.jy === viewYear && selectedDate.jm === viewMonth && selectedDate.jd === jd;
  };

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          type="button"
        >
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          {JALALI_MONTHS[viewMonth - 1]} {viewYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          type="button"
        >
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {JALALI_WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const past = isPastDate(day);
          const booked = isBooked(day);
          const selected = isSelected(day);
          const disabled = past || booked;

          return (
            <motion.button
              key={day}
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.9 } : {}}
              onClick={() => !disabled && onSelectDate?.({ jy: viewYear, jm: viewMonth, jd: day })}
              disabled={disabled}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 relative",
                selected
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40"
                  : past
                  ? "text-slate-600 cursor-not-allowed"
                  : booked
                  ? "text-slate-600 cursor-not-allowed line-through"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
              type="button"
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
