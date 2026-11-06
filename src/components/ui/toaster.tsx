"use client";

import * as React from "react";
import { toast as sonnerToast, Toast as SonnerToast, Toaster as SonnerToaster } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactElement;
};

export type ToastActionElement = React.ReactElement;

const Toast = React.forwardRef<
  HTMLElement,
  ToastProps & { className?: string }
>(({ className, ...props }, ref) => (
  <SonnerToast ref={ref} {...props} />
));

Toast.displayName = "Toast";

type ToasterProps = {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  richColors?: boolean;
};

export const Toaster = ({ position = "top-right", richColors = true }: ToasterProps) => {
  return <SonnerToaster position={position} richColors={richColors} />;
};

export { toast as sonnerToast } from "sonner";

export const useToast = () => {
  return {
    toast: (options: ToastProps) => {
      return sonnerToast(options.title ?? "", {
        description: options.description,
        action: options.action,
      });
    },
  };
};
