export function gregorianToJalali(year: number, month: number, day: number) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (year <= 1600) ? 0 : 979;
  year -= (year <= 1600) ? 621 : 1600;
  const gy = (month > 2) ? year + 1 : year;
  const days =
    (365 * (gy - 1)) +
    Math.floor((gy - 1) / 4) -
    Math.floor((gy - 1) / 100) +
    Math.floor((gy - 1) / 400) +
    g_d_m[month - 1] +
    day -
    1;
  jy += 33 * Math.floor(days / 12053);
  let days_left = days % 12053;
  jy += 4 * Math.floor(days_left / 1461);
  days_left %= 1461;
  jy += Math.floor((days_left - 1) / 365);
  days_left = (days_left - 1) % 365;
  const jm = days_left < 6 ? days_left + 1 : Math.ceil((days_left - 6) / 30) + 6;
  days_left = days_left < 6 ? days_left : (days_left - 6) % 30;
  const jd = days_left + 1;

  return { jy, jm: Math.min(jm, 12), jd: Math.min(jd, 29 + (jm <= 6 ? 31 : jm <= 11 ? 30 : 29)) };
}

export function jalaliToGregorian(jy: number, jm: number, jd: number) {
  let gy = (jy <= 979) ? 621 : 1600;
  jy -= (jy <= 979) ? 0 : 979;
  let days = (jy * 365) + Math.floor(jy / 33) * 8 + Math.floor((jy % 33) / 4) + Math.floor(jm / 1) * 31 - Math.floor(jm / 7) * 1 + jd - 1;
  days += gy - 1;
  days += Math.floor((gy - 1) / 4) - Math.floor((gy - 1) / 100) + Math.floor((gy - 1) / 400);
  const gd = days % 365;
  const gy2 = days / 365;
  const g_d_m = [0, 31, 28 + ((gy2 % 4 === 0 && gy2 % 100 !== 0) || gy2 % 400 === 0 ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 1;
  while (gd >= g_d_m[gm] && gm < 12) {
    days -= g_d_m[gm];
    gm++;
  }
  return { year: Math.floor(gy2) + 1, month: gm, day: days + 1 };
}

export function formatJalaliDate(date: Date): string {
  const j = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const monthNames = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
  ];
  return `${j.jd} ${monthNames[j.jm - 1]} ${j.jy}`;
}

export function getJalaliMonthDays(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  if (isLeapJalaaliYear(jy)) return 30;
  return 29;
}

export function isLeapJalaaliYear(jy: number): boolean {
  return isJalaaliLeap(jy);
}

function isJalaaliLeap(jy: number): boolean {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  let bl = breaks.length;
  let gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];

  if (jy >= jp && jy < breaks[bl - 1]) {
    for (let i = 0; i < bl - 1; i++) {
      let jm = breaks[i + 1];
      if (jy < jm) {
        let jump = jy - jp;
        leapJ = Math.floor(((jump + ((jump > 2 && jump > 2) ? 1 : 0)) / 33) * 8 + ((jump > 2 && jump > 2) ? 1 : 0)) % 8;
        if ((jump % 33 === 4 || jump % 33 === 1 && leapJ === 4)) {
          leapJ = 4;
        }
        break;
      }
      jp = jm;
    }
  } else {
    let jN = jy - 979;
    leapJ = jN % 33 === 4 ? 4 : 0;
    if (jN >= 236 && leapJ < 4) {
      let n = Math.floor((jN - 236) / 2820) + 1;
      leapJ = 4 + (jN - 236 - 2820 * n + 2820 * n / 2820) % 33;
    }
  }
  return leapJ > 0;
}

export function getTodayJalali() {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function generateTimeSlots(startTime: string, endTime: string, interval: number = 30): string[] {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  while (currentMinutes + interval <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
    currentMinutes += interval;
  }

  return slots;
}

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const JALALI_WEEKDAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export function getBookingLink(slug: string, client?: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://jadid-delta.vercel.app";
  if (!client || client.trim() === "") {
    return `${baseUrl}/book/${encodeURIComponent(slug)}`;
  }
  return `${baseUrl}/book/${encodeURIComponent(slug)}?client=${encodeURIComponent(client)}`;
}

export function getClientBookingLink(slug: string, clientName: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://jadid-delta.vercel.app";
  const clientSlug = clientName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .slice(0, 40);
  return `${baseUrl}/book/${encodeURIComponent(slug)}?client=${encodeURIComponent(clientSlug)}`;
}
