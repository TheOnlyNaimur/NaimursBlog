"use client";

import type { ReactNode } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

type ToastProps = {
  title: string;
  message?: string;
  variant?: ToastVariant;
  onDismiss: () => void;
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-emerald-500/25 bg-emerald-500/12 text-emerald-950",
  error: "border-rose-500/25 bg-rose-500/12 text-rose-950",
  info: "border-[var(--color-border)] bg-[rgba(253,252,240,0.92)] text-[var(--color-text)]",
};

const variantIcons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5" />,
  error: <CircleAlert className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

export function Toast({
  title,
  message,
  variant = "info",
  onDismiss,
}: ToastProps) {
  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl shadow-black/10 backdrop-blur-xl ${variantStyles[variant]}`}
      role="status"
      aria-live="polite"
    >
      <div className="mt-0.5 shrink-0">{variantIcons[variant]}</div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        {message ? (
          <p className="mt-1 text-sm opacity-75">{message}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="rounded-full p-1 transition-colors hover:bg-black/5"
        aria-label="Dismiss toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
