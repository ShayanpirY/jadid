"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

const serviceSchema = z.object({
  title: z.string().min(2, "نام خدمت را وارد کنید"),
  description: z.string().optional(),
  durationMinutes: z.coerce.number<number>().min(5, "حداقل ۵ دقیقه"),
  price: z.coerce.number<number>().min(0, "قیمت نمی‌تواند منفی باشد"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface Service {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

interface ServicesPageProps {
  providerSlug: string;
}

export default function ServicesPage({ providerSlug }: ServicesPageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`/api/dashboard/${providerSlug}`);
        const data = await res.json();
        setServices(data.services || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [providerSlug]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (editingId) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === editingId ? { ...s, ...data } : s
          )
        );
        setEditingId(null);
      } else {
        const newService: Service = {
          id: Date.now().toString(),
          ...data,
          isActive: true,
        };
        setServices((prev) => [...prev, newService]);
      }
      reset();
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setIsAdding(true);
    reset({
      title: service.title,
      description: service.description || "",
      durationMinutes: service.durationMinutes,
      price: service.price,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">مدیریت خدمات</h1>
          <p className="text-slate-400 mt-1">خدمات خود را اضافه و مدیریت کنید</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            افزودن خدمت
          </Button>
        )}
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              {editingId ? "ویرایش خدمت" : "افزودن خدمت جدید"}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label required>نام خدمت</Label>
                  <Input {...register("title")} placeholder="مثال: اصلاح مو" error={errors.title?.message} />
                </div>
                <div>
                  <Label required>قیمت (تومان)</Label>
                  <Input {...register("price")} type="number" placeholder="مثال: ۱۵۰۰۰۰" error={errors.price?.message} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label required>مدت زمان (دقیقه)</Label>
                  <Input {...register("durationMinutes")} type="number" placeholder="مثال: ۴۵" error={errors.durationMinutes?.message} />
                </div>
                <div>
                  <Label>توضیحات</Label>
                  <Input {...register("description")} placeholder="توضیحات اختیاری" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {editingId ? "ذخیره تغییرات" : "افزودن خدمت"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    reset();
                  }}
                >
                  انصراف
                </Button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard
              className={`p-5 ${!service.isActive ? "opacity-60" : ""}`}
              hover
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-200">{service.title}</h3>
                  {service.description && (
                    <p className="text-sm text-slate-400 mt-1">{service.description}</p>
                  )}
                </div>
                <Badge variant={service.isActive ? "success" : "default"}>
                  {service.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-slate-400">{service.durationMinutes} دقیقه</span>
                <span className="font-bold text-purple-400">
                  {service.price.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleActive(service.id)}
                  className="flex-1"
                >
                  {service.isActive ? "غیرفعال" : "فعال"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startEdit(service)}
                  className="flex-1"
                >
                  ویرایش
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteService(service.id)}
                  className="text-pink-400 hover:text-pink-300"
                >
                  حذف
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {services.length === 0 && !isAdding && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-slate-400">هنوز خدمتی تعریف نکرده‌اید</p>
        </div>
      )}
    </div>
  );
}
