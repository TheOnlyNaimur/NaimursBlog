"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CreatorTransitionOverlay } from "@/components/shared/creator/creatorTransitionOverlay";

type CreatorTransitionContextValue = {
  openCreatorTransition: (href?: string) => void;
  isTransitionOpen: boolean;
};

const CreatorTransitionContext =
  createContext<CreatorTransitionContextValue | null>(null);

export function CreatorTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [isTransitionOpen, setIsTransitionOpen] = useState(false);
  const [phase, setPhase] = useState(0);
  const [targetHref, setTargetHref] = useState("/creator");
  const [transitionRun, setTransitionRun] = useState(0);

  const openCreatorTransition = useCallback(
    (href = "/creator") => {
      setTargetHref(href);
      setPhase(0);
      setIsTransitionOpen(true);
      setTransitionRun((current) => current + 1);

      try {
        router.prefetch(href);
      } catch {
        // Prefetch is an enhancement only.
      }
    },
    [router]
  );

  const closeCreatorTransition = useCallback(() => {
    setIsTransitionOpen(false);
    setPhase(0);
  }, []);

  useEffect(() => {
    if (!isTransitionOpen) {
      return;
    }

    const timers = [
      window.setTimeout(() => setPhase(1), 100),
      window.setTimeout(() => setPhase(2), 420),
      window.setTimeout(() => setPhase(3), 860),
      window.setTimeout(() => setPhase(4), 1260),
      window.setTimeout(() => {
        router.push(targetHref);
      }, 1280),
      window.setTimeout(() => {
        closeCreatorTransition();
      }, 1740),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [closeCreatorTransition, isTransitionOpen, router, targetHref, transitionRun]);

  const value = useMemo(
    () => ({
      openCreatorTransition,
      isTransitionOpen,
    }),
    [isTransitionOpen, openCreatorTransition]
  );

  return (
    <CreatorTransitionContext.Provider value={value}>
      {children}
      {isTransitionOpen ? <CreatorTransitionOverlay phase={phase} /> : null}
    </CreatorTransitionContext.Provider>
  );
}

export function useCreatorTransition() {
  const context = useContext(CreatorTransitionContext);

  if (!context) {
    throw new Error(
      "useCreatorTransition must be used inside CreatorTransitionProvider"
    );
  }

  return context;
}
