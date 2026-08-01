import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, email, password, slug, plan } = body;

    if (!businessName || !email || !password || !slug || !plan) {
      return NextResponse.json({ error: "تمام فیلدها الزامی هستند" }, { status: 400 });
    }

    const existingProvider = await prisma.provider.findUnique({
      where: { slug },
    });

    if (existingProvider) {
      return NextResponse.json({ error: "این شناسه قبلاً استفاده شده است" }, { status: 409 });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json({ error: "این ایمیل قبلاً ثبت شده است" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name: businessName,
        role: "PROVIDER",
        provider: {
          create: {
            businessName,
            slug,
            email,
            phone: "",
            subscriptionStatus: "TRIAL",
            subscriptionTier: plan,
            subscriptionStart: new Date(),
            subscriptionEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        provider: true,
      },
    });

    return NextResponse.json({ success: true, user, provider: user.provider }, { status: 201 });
  } catch (error) {
    console.error("Error registering:", error);
    return NextResponse.json({ error: "خطا در ثبت‌نام" }, { status: 500 });
  }
}
