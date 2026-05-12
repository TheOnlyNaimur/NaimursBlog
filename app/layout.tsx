import type { Metadata } from "next";
import "./globals.css";
import { AuthModalProvider } from "@/components/shared/auth/authModalProvider";
import { CreatorTransitionProvider } from "@/components/shared/creator/creatorTransitionProvider";
import { ToastProvider } from "@/components/ui/toastProvider";

export const metadata: Metadata = {
  title: "Naimurs Blog",
  description: "Software Developer & Researcher Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <ToastProvider>
          <AuthModalProvider>
            <CreatorTransitionProvider>{children}</CreatorTransitionProvider>
          </AuthModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
