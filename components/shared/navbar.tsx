"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthModal } from "@/components/shared/auth/authModalProvider";
import { useCreatorTransition } from "@/components/shared/creator/creatorTransitionProvider";
import { useToast } from "@/components/ui/toastProvider";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Bookmark,
  CircleUserRound,
  LogOut,
  Menu,
  NotebookPen,
  Search,
  Settings,
  WandSparkles,
} from "lucide-react";

type NavbarProps = {
  title?: string;
};

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar: string;
};

const topNav = [
  { href: "/", label: "Feed", key: "feed" },
  { href: "/blogs", label: "Blogs", key: "blogs" },
  { href: "/library", label: "Library", key: "library" },
  { href: "/creator", label: "Studio", key: "studio" },
] as const;

type NavKey = (typeof topNav)[number]["key"];

function getActiveKey(pathname: string): NavKey {
  if (pathname === "/" || pathname.startsWith("/blog")) return "feed";
  if (pathname.startsWith("/blogs")) return "blogs";
  if (pathname.startsWith("/library")) return "library";
  if (pathname.startsWith("/creator")) return "studio";
  return "feed";
}

export function Navbar({
  title = "Naimurs Blog",
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const active = getActiveKey(pathname);
  const { openLogin } = useAuthModal();
  const { openCreatorTransition } = useCreatorTransition();
  const { showToast } = useToast();

  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const canSeeCreatorMode = currentUser?.role === "ADMIN";
  const visibleTopNav = topNav.filter(
    (item) => item.key !== "studio" || canSeeCreatorMode
  );
  const navItemBaseClass =
    "transition-colors duration-200 text-[var(--color-text)]/60 hover:text-[var(--color-text)]";
  const navItemActiveClass =
    "border-b border-[var(--color-accent)] pb-1 text-[var(--color-accent)]";

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/current-user", {
          method: "GET",
          credentials: "include",
        });

        const data = (await response.json()) as { user: SessionUser | null };
        setCurrentUser(data.user);
      } catch {
        setCurrentUser(null);
      }
    }

    loadCurrentUser();
  }, []);

  useEffect(() => {
    function handleAuthChanged() {
      void (async () => {
        try {
          const response = await fetch("/api/auth/current-user", {
            method: "GET",
            credentials: "include",
          });

          const data = (await response.json()) as { user: SessionUser | null };
          setCurrentUser(data.user);
        } catch {
          setCurrentUser(null);
        }
      })();
    }

    window.addEventListener("auth-changed", handleAuthChanged);

    return () => window.removeEventListener("auth-changed", handleAuthChanged);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      window.dispatchEvent(new Event("auth-changed"));
      setCurrentUser(null);
      setProfileOpen(false);
      router.refresh();
      showToast({
        title: "Logged out",
        message: "You’ve been signed out successfully.",
        variant: "success",
      });
    } catch {
      showToast({
        title: "Logout failed",
        message: "Please try again.",
        variant: "error",
      });
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden p-1 text-[var(--color-accent)]"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              href="/"
              className="font-serif text-2xl tracking-tight text-[var(--color-text)]"
            >
              {title}
            </Link>
          </div>

          <nav className="hidden items-center gap-10 text-[11px] font-medium uppercase tracking-[0.2em] lg:flex">
            {visibleTopNav.map((item) => {
              const isActive = item.key === active;

              if (item.key === "studio") {
                return (
                  <Link
                    key={item.href}
                    href="/creator"
                    onClick={(event) => {
                      event.preventDefault();
                      openCreatorTransition("/creator");
                    }}
                    className={navItemBaseClass}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? navItemActiveClass : navItemBaseClass}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-white/50 px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--color-text)]/70 transition-all hover:bg-white sm:px-6"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {!currentUser ? (
              <button
                type="button"
                onClick={openLogin}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--color-text)]/75 transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] sm:px-5"
              >
                Login
              </button>
            ) : (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] transition-all hover:border-[var(--color-accent)]"
                  aria-label="Open profile menu"
                  title={currentUser.name}
                >
                  {currentUser.avatar ? (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <CircleUserRound className="h-6 w-6 text-[var(--color-text)]/70" />
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl shadow-black/10">
                    <div className="border-b border-[var(--color-border)] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text)]/45">
                        Signed in as
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text)]">
                        {currentUser.name}
                      </p>
                    </div>

                    <div className="flex flex-col py-2">
                      <button
                        type="button"
                        className="flex items-center gap-3 px-4 py-3 text-left text-sm text-[var(--color-text)]/80 transition-colors hover:bg-white/40 hover:text-[var(--color-accent)]"
                      >
                        <Settings className="h-4 w-4" />
                        Change name
                      </button>

                      {canSeeCreatorMode && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            openCreatorTransition("/creator");
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-left text-sm text-[var(--color-text)]/80 transition-colors hover:bg-white/40 hover:text-[var(--color-accent)]"
                        >
                          <WandSparkles className="h-4 w-4" />
                          Creator Mode
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-left text-sm text-[var(--color-text)]/80 transition-colors hover:bg-white/40 hover:text-[var(--color-accent)]"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 px-3 py-2 backdrop-blur md:hidden">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${visibleTopNav.length}, minmax(0, 1fr))`,
          }}
        >
          {visibleTopNav.map((item) => {
            const isActive = item.key === active;
            const Icon =
              item.key === "feed"
                ? Bookmark
                : item.key === "blogs"
                  ? NotebookPen
                  : item.key === "library"
                    ? BookOpen
                    : WandSparkles;

            if (item.key === "studio") {
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => openCreatorTransition("/creator")}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] uppercase tracking-widest ${
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text)]/50"
                  }`}
                >
                  <WandSparkles className="h-4 w-4" />
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] uppercase tracking-widest ${
                  isActive
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-text)]/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
