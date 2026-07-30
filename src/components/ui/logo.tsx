"use client";

import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const innerIconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "relative rounded-xl flex items-center justify-center shadow-lg",
        "bg-gradient-to-br from-purple-500/20 to-cyan-500/20",
        "backdrop-blur-xl border border-white/20",
        "shadow-purple-500/30",
        iconSizes[size],
        className
      )}
    >
      <CalendarDays className={cn("text-purple-300", innerIconSizes[size])} />
      <Sparkles
        className={cn(
          "text-cyan-300 absolute -top-1 -left-1",
          size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5"
        )}
      />
    </motion.div>
  );
}
