import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, serviceId, date, time, notes } = body;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { provider: true },
    });

    if (!service) {
      return NextResponse.json({ error: "خدمت یافت نشد" }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        serviceId,
        providerId: service.providerId,
        customerName,
        customerPhone,
        date,
        time,
        notes: notes || null,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "خطا در ثبت رزرو" }, { status: 500 });
  }
}
