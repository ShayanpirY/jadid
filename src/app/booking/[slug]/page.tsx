import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BookingClient from "@/components/booking-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProvider(slug: string) {
  const provider = await prisma.provider.findUnique({
    where: { slug },
    include: {
      services: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
    },
  });
  return provider;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const provider = await getProvider(slug);

  if (!provider) {
    return { title: "یافت نشد" };
  }

  return {
    title: `${provider.businessName} - رزرو آنلاین`,
    description: provider.bio || `رزرو نوبت آنلاین از ${provider.businessName}`,
  };
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = await getProvider(slug);

  if (!provider) {
    notFound();
  }

  const services = provider.services;

  return <BookingClient provider={provider} services={services} />;
}
