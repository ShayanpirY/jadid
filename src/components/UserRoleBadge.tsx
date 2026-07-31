import { cn } from "@/lib/utils";
import { Shield, User, Crown } from "lucide-react";

type Role = "ADMIN" | "PROVIDER" | "CLIENT";

interface UserRoleBadgeProps {
  role: Role;
  className?: string;
}

const roleConfig = {
  ADMIN: {
    label: "مدیر",
    icon: <Crown className="w-3.5 h-3.5" />,
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  PROVIDER: {
    label: "ارائه‌دهنده",
    icon: <Shield className="w-3.5 h-3.5" />,
    className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  CLIENT: {
    label: "کاربر",
    icon: <User className="w-3.5 h-3.5" />,
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
};

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const config = roleConfig[role] || roleConfig.CLIENT;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
        config.className,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
