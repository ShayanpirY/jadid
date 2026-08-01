import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret } = body;

    if (secret !== "nobatro-seed-2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slug = "shayan";
    const existingProvider = await prisma.provider.findUnique({
      where: { slug },
    });

    if (existingProvider) {
      return NextResponse.json({ message: "Seed data already exists", provider: existingProvider }, { status: 200 });
    }

    const user = await prisma.user.create({
      data: {
        email: "shayan",
        password: "12345",
        name: "مجموعه شایان",
        role: "PROVIDER",
        provider: {
          create: {
            businessName: "مجموعه شایان",
            slug,
            email: "shayan@nobatro.ir",
            phone: "۰۹۱۲۰۰۰۰۰۰۰",
            subscriptionStatus: "ACTIVE",
            subscriptionTier: "ONE_YEAR",
            subscriptionStart: new Date(),
            subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        provider: true,
      },
    });

    const provider = user.provider!;

    const appointments = await prisma.appointment.createMany({
      data: [
        {
          providerId: provider.id,
          serviceId: "demo-s1",
          customerName: "علی محمدی",
          customerPhone: "۰۹۱۲۳۴۵۶۷۸۹",
          date: "۱۴۰۵/۰۵/۱۵",
          time: "۱۰:۰۰",
          status: "CONFIRMED",
          notes: "نوبت تایید شده",
        },
        {
          providerId: provider.id,
          serviceId: "demo-s1",
          customerName: "سارا احمدی",
          customerPhone: "۰۹۱۳۴۵۶۷۸۹۰",
          date: "۱۴۰۵/۰۵/۱۵",
          time: "۱۱:۳۰",
          status: "CONFIRMED",
          notes: "نوبت تایید شده",
        },
        {
          providerId: provider.id,
          serviceId: "demo-s1",
          customerName: "رضا کریمی",
          customerPhone: "۰۹۱۴۵۶۷۸۹۰۱",
          date: "۱۴۰۵/۰۵/۱۶",
          time: "۰۹:۰۰",
          status: "CONFIRMED",
          notes: "نوبت تایید شده",
        },
        {
          providerId: provider.id,
          serviceId: "demo-s1",
          customerName: "مریم رضایی",
          customerPhone: "۰۹۱۵۶۷۸۹۰۱۲",
          date: "۱۴۰۵/۰۵/۱۴",
          time: "۱۴:۰۰",
          status: "CANCELLED",
          notes: "لغو شده توسط مشتری",
        },
        {
          providerId: provider.id,
          serviceId: "demo-s1",
          customerName: "امیر حسینی",
          customerPhone: "۰۹۱۶۷۸۹۰۱۲۳",
          date: "۱۴۰۵/۰۵/۱۷",
          time: "۱۵:۳۰",
          status: "CONFIRMED",
          notes: "نوبت تایید شده",
        },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: "داده‌های نمونه با موفقیت ایجاد شدند",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      provider: {
        id: provider.id,
        businessName: provider.businessName,
        slug: provider.slug,
        email: provider.email,
        subscriptionStatus: provider.subscriptionStatus,
        subscriptionTier: provider.subscriptionTier,
        subscriptionEnd: provider.subscriptionEnd,
      },
      appointmentsCreated: appointments.count,
    }, { status: 201 });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ error: "خطا در ایجاد داده‌های نمونه" }, { status: 500 });
  }
}
