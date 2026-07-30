import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await prisma.provider.findUnique({
    where: { slug },
    include: {
      services: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
      appointments: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!provider) {
    redirect("/");
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15]">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d0e15]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30"
                style={{ background: `linear-gradient(135deg, ${provider.brandColor || "#a855f7"}, ${(provider.brandColor || "#a855f7")}dd)` }}
              >
                {provider.businessName.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  داشبورد {provider.businessName}
                </h1>
                <p className="text-xs text-slate-400">مدیریت نوبتی</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:text-purple-300 font-medium"
              >
                مشاهده صفحه رزرو
              </a>
              <a
                href={`/dashboard/${slug}/settings`}
                className="text-sm text-purple-400 hover:text-purple-300 font-medium"
              >
                تنظیمات
              </a>
              <a
                href="/"
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                خروج
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
