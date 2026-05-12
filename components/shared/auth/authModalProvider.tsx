"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { LoginOverlay } from "@/components/shared/auth/loginOverlay";

type AuthModalContextValue = {
  openLogin: () => void;
  closeLogin: () => void;
  isLoginOpen: boolean;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  function openLogin() {
    setIsLoginOpen(true);
  }

  function closeLogin() {
    setIsLoginOpen(false);
  }

  return (
    <AuthModalContext.Provider
      value={{
        openLogin,
        closeLogin,
        isLoginOpen,
      }}
    >
      {children}
      {isLoginOpen ? <LoginOverlay onClose={closeLogin} /> : null}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }

  return context;
}
