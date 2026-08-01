import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const provider = await prisma.provider.findUnique({
      where: { slug },
      include: {
        services: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
        appointments: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }

    const { password, ...providerData } = provider as any;

    return NextResponse.json({
      provider: providerData,
      services: provider.services,
      appointments: provider.appointments,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "خطا در دریافت اطلاعات" }, { status: 500 });
  }
}
