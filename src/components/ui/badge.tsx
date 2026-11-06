"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const variants = {
  default: "bg-violet-600 text-white",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-red-500 text-white",
  outline: "border border-input bg-transparent",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = "Badge";

export { Badge };
