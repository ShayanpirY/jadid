export interface Provider {
  id: string;
  slug: string;
  businessName: string;
  category?: string | null;
  bio?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  phone: string;
  email: string;
  address?: string | null;
  instagramUrl?: string | null;
  telegramUrl?: string | null;
  googleMapsUrl?: string | null;
  brandColor?: string | null;
  customDomain?: string | null;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier?: SubscriptionTier | null;
  subscriptionStart?: Date | null;
  subscriptionEnd?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  depositAmount?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Availability {
  id: string;
  providerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

export interface Appointment {
  id: string;
  providerId: string;
  serviceId: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface BookingFormData {
  customerName: string;
  customerPhone: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";
export type SubscriptionTier = "ONE_MONTH" | "THREE_MONTHS" | "ONE_YEAR";
export type AppointmentStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

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
