import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15] flex items-center justify-center p-4">
      <GlassCard className="p-8 sm:p-12 text-center max-w-lg">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
          صفحه پیدا نشد
        </h1>
        <p className="text-slate-400 mb-8">
          متاسفانه صفحه مورد نظر شما وجود ندارد. لطفاً آدرس را بررسی کنید یا به صفحه اصلی برگردید.
        </p>
        <a href="/" className="block">
          <Button className="w-full">بازگشت به صفحه اصلی</Button>
        </a>
      </GlassCard>
    </div>
  );
}
