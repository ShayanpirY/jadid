import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "شناسه کسب‌وکار الزامی است" }, { status: 400 });
    }

    const provider = await prisma.provider.findUnique({
      where: { slug },
      select: {
        id: true,
        businessName: true,
        slug: true,
        email: true,
        phone: true,
        bio: true,
        category: true,
        address: true,
        brandColor: true,
        subscriptionStatus: true,
        subscriptionTier: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ provider });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "خطا در دریافت اطلاعات" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { businessName, email, phone, bio, category, address, newSlug, currentSlug } = body;

    if (!currentSlug) {
      return NextResponse.json({ error: "شناسه کسب‌وکار الزامی است" }, { status: 400 });
    }

    const existingProvider = await prisma.provider.findUnique({
      where: { slug: currentSlug },
    });

    if (!existingProvider) {
      return NextResponse.json({ error: "کسب‌وکار یافت نشد" }, { status: 404 });
    }

    if (newSlug && newSlug !== currentSlug) {
      const slugExists = await prisma.provider.findUnique({
        where: { slug: newSlug },
      });

      if (slugExists) {
        return NextResponse.json({ error: "این شناسه قبلاً استفاده شده است" }, { status: 409 });
      }
    }

    const updatedProvider = await prisma.provider.update({
      where: { slug: currentSlug },
      data: {
        businessName: businessName || existingProvider.businessName,
        email: email || existingProvider.email,
        phone: phone || existingProvider.phone,
        bio: bio ?? existingProvider.bio,
        category: category ?? existingProvider.category,
        address: address ?? existingProvider.address,
        slug: newSlug || existingProvider.slug,
      },
      select: {
        id: true,
        businessName: true,
        slug: true,
        email: true,
        phone: true,
        bio: true,
        category: true,
        address: true,
        brandColor: true,
        subscriptionStatus: true,
        subscriptionTier: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ provider: updatedProvider });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی اطلاعات" }, { status: 500 });
  }
}
