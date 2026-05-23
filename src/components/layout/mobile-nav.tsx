"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Heart, Upload, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: LayoutDashboard },
  { href: "/dashboard/chat", icon: MessageSquare },
  { href: "/dashboard/know-yourself", icon: Heart },
  { href: "/dashboard/upload", icon: Upload },
  { href: "/dashboard/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-[var(--border)] safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[56px]",
                active ? "text-accent-primary" : "text-muted"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "drop-shadow-[0_0_8px_rgba(108,99,255,0.8)]")} />
              {active && (
                <span className="w-1 h-1 rounded-full bg-accent-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
