"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

const variants = {
  primary:
    "bg-accent-gradient text-white shadow-glow hover:shadow-glow-cyan border-0",
  secondary:
    "glass text-white border border-white/20 hover:border-accent-primary/50",
  ghost: "bg-transparent text-[var(--text-primary)] hover:bg-white/5",
  outline:
    "border border-accent-primary text-accent-primary hover:bg-accent-primary/10",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className,
  type = "button",
}: ButtonProps) {
  const classes = cn(
    "btn-glow inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 relative z-10",
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <motion.span
      className="relative z-10 flex items-center gap-2"
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href}>
        <motion.div className={classes} whileHover={{ scale: 1.03 }}>
          {content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {content}
    </motion.button>
  );
}
