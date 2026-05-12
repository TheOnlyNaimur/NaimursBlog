"use client";

import { LoginCard } from "@/components/shared/auth/loginCard";

type LoginOverlayProps = {
  onClose: () => void;
};

export function LoginOverlay({ onClose }: LoginOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[rgba(253,252,240,0.04)] backdrop-blur-[8px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(193,138,99,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(74,63,54,0.06),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-md">
        <LoginCard onClose={onClose} />
      </div>
    </div>
  );
}
