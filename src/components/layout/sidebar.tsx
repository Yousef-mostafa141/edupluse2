"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Mail,
  Bell,
  Heart,
  Upload,
  BarChart3,
  Calendar,
  CheckSquare,
  FileText,
  Settings,
  User,
  BookOpen,
  Focus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/app-context";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/dashboard/chat", icon: MessageSquare, key: "aiChat" as const },
  { href: "/dashboard/messages", icon: Mail, key: "messages" as const },
  { href: "/dashboard/notifications", icon: Bell, key: "notifications" as const },
  { href: "/dashboard/know-yourself", icon: Heart, key: "knowYourself" as const },
  { href: "/dashboard/upload", icon: Upload, key: "uploadFiles" as const },
  { href: "/dashboard/books", icon: BookOpen, key: "askBook" as const },
  { href: "/dashboard/analytics", icon: BarChart3, key: "analytics" as const },
  { href: "/dashboard/calendar", icon: Calendar, key: "calendar" as const },
  { href: "/dashboard/tasks", icon: CheckSquare, key: "tasks" as const },
  { href: "/dashboard/focus", icon: Focus, key: "focusMode" as const },
  { href: "/dashboard/reports", icon: FileText, key: "reports" as const },
  { href: "/dashboard/settings", icon: Settings, key: "settings" as const },
  { href: "/dashboard/profile", icon: User, key: "profile" as const },
];

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <aside
      className={cn(
        "flex flex-col h-full glass border-r border-[var(--border)]",
        mobile ? "w-72" : "w-64 hidden lg:flex"
      )}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-lg">EduPulse AI</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative",
                  active
                    ? "bg-accent-primary/20 text-accent-primary"
                    : "text-muted hover:text-white hover:bg-white/5"
                )}
                whileHover={{ x: 4 }}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-accent-primary/10 border border-accent-primary/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10 text-sm font-medium">{t(item.key)}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
