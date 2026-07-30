import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SubscriptionExpiredPage({ params }: PageProps) {
  const { slug } = await params;

  const provider = await prisma.provider.findUnique({
    where: { slug },
    select: { businessName: true, subscriptionStatus: true },
  });

  if (!provider || provider.subscriptionStatus !== "EXPIRED") {
    redirect("/");
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-3">
            حساب کاربری نیازمند تمدید است
          </h1>
          <p className="text-slate-400">
            اشتراک <span className="font-bold text-slate-200">{provider.businessName}</span> منقضی شده است.
            برای ادامه استفاده از پلتفرم، لطفاً اشتراک خود را تمدید کنید.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl p-8">
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <svg className="w-6 h-6 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-300">
                با تمدید اشتراک، تمام قابلیت‌های پلتفرم از جمله دریافت رزرو و مدیریت نوبت‌ها بازگردانده می‌شود.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              تمدید اشتراک
            </Button>
            <a
              href={`/dashboard/${slug}/subscription`}
              className="block"
            >
              <Button variant="ghost" className="w-full">
                مشاهده پلان‌ها و تعرفه‌ها
              </Button>
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          © {new Date().getFullYear()} نوبتی. تمامی حقوق محفوظ است.
        </p>
      </motion.div>
    </div>
  );
}
