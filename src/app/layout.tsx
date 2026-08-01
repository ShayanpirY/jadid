import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "نوبتی - پلتفرم رزرو آنلاین",
  description: "سیستم نوبت‌دهی و رزرو آنلاین اختصاصی برای کسب‌وکارها",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0d0e15] text-slate-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
