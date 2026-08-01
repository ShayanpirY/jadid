import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "نام کاربری و رمز عبور الزامی هستند" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { contains: username } },
          { name: { contains: username } },
        ],
      },
      include: {
        provider: true,
      },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: "نام کاربری یا رمز عبور اشتباه است" }, { status: 401 });
    }

    if (!user.provider) {
      return NextResponse.json({ success: false, message: "حساب کسب‌وکار یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      provider: {
        id: user.provider.id,
        businessName: user.provider.businessName,
        slug: user.provider.slug,
        email: user.provider.email,
        subscriptionStatus: user.provider.subscriptionStatus,
        subscriptionTier: user.provider.subscriptionTier,
        subscriptionEnd: user.provider.subscriptionEnd,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "خطا در ارتباط با سرور" }, { status: 500 });
  }
}
