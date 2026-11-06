"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  size?: "sm" | "default" | "lg";
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizes = {
      sm: "h-6 w-6",
      default: "h-9 w-9",
      lg: "h-12 w-12",
    };

    return (
      <img
        ref={ref}
        className={cn(
          "rounded-full object-cover shrink-0 bg-secondary",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
