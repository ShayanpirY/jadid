export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/demo")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/subscription-expired")) {
    return NextResponse.next();
  }

  const slugMatch = pathname.match(/^\/([^\/]+)$/);
  if (slugMatch) {
    const slug = slugMatch[1];

    try {
      const provider = await prisma.provider.findUnique({
        where: { slug },
        select: {
          id: true,
          subscriptionStatus: true,
          subscriptionEnd: true,
        },
      });

      if (!provider) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (provider.subscriptionStatus === "EXPIRED" || provider.subscriptionStatus === "CANCELLED") {
        return NextResponse.redirect(new URL("/subscription-expired", request.url));
      }

      if (
        provider.subscriptionStatus === "TRIAL" ||
        provider.subscriptionStatus === "ACTIVE"
      ) {
        if (provider.subscriptionEnd && new Date(provider.subscriptionEnd) < new Date()) {
          await prisma.provider.update({
            where: { id: provider.id },
            data: { subscriptionStatus: "EXPIRED" },
          });
          return NextResponse.redirect(new URL("/subscription-expired", request.url));
        }
      }
    } catch (error) {
      console.error("Middleware error:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api).*)"],
};
