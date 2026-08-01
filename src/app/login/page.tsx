import { Suspense } from "react";
import AuthModal from "@/components/AuthModal";
import LoginClient from "@/components/LoginClient";

export default function LoginPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-400">در حال بارگذاری...</div>}>
        <LoginClient />
      </Suspense>
    </div>
  );
}
