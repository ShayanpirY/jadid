import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BookingClient from "@/components/booking-client";

async function getProvider() {
  const provider = await prisma.provider.findUnique({
    where: { slug: "amir" },
    include: {
      services: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
    },
  });
  return provider;
}

export async function generateMetadata() {
  const provider = await getProvider();

  if (!provider) {
    return { title: "یافت نشد" };
  }

  return {
    title: `${provider.businessName} - رزرو آنلاین`,
    description: provider.bio || `رزرو نوبت آنلاین از ${provider.businessName}`,
  };
}

export default async function AmirBookingPage() {
  const provider = await getProvider();

  if (!provider) {
    notFound();
  }

  const services = provider.services;

  return <BookingClient provider={provider} services={services} />;
}
