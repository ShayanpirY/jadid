import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({ children, className, hover = false, glow = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg",
        hover && "hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
        glow && "shadow-purple-500/20",
        className
      )}
    >
      {children}
    </div>
  );
}
