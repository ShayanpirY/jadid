"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Copy, Check, ExternalLink, UserPlus } from "lucide-react";
import { getClientBookingLink } from "@/lib/utils";

interface BookingLinkCardProps {
  businessSlug: string;
  businessName?: string;
  defaultClient?: string;
}

export default function BookingLinkCard({ businessSlug, businessName, defaultClient }: BookingLinkCardProps) {
  const [clientName, setClientName] = useState(defaultClient || "");
  const [copied, setCopied] = useState(false);

  const bookingUrl = getClientBookingLink(businessSlug, clientName);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="p-6 border-purple-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-200">لینک رزرو اختصاصی</h3>
          <p className="text-sm text-slate-400">
            لینک مخصوص {businessName || "کسب‌وکار"} را برای مشتریان خود کپی کنید
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">نام مشتری (اختیاری)</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="مثال: علی رضایی"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">لینک تولید شده</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-sm text-slate-200 font-mono break-all">{bookingUrl}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="sm" variant="secondary" onClick={handleCopy} className="flex items-center gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "کپی شد" : "کپی لینک"}
          </Button>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="ghost" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              مشاهده
            </Button>
          </a>
        </div>
      </div>
    </GlassCard>
  );
}
