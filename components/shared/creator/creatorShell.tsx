"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenText,
  Home,
  Library,
  LogOut,
  NotebookPen,
  Newspaper,
  PanelLeftClose,
  SquarePen,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useToast } from "@/components/ui/toastProvider";

type CreatorShellProps = {
  children: ReactNode;
};

const creatorNav = [
  {
    href: "/creator",
    label: "Overview",
    description: "Dashboard home",
    icon: PanelLeftClose,
  },
  {
    href: "/creator/blog-editor",
    label: "Blog Editor",
    description: "Write and publish posts",
    icon: SquarePen,
  },
  {
    href: "/creator/blog-management",
    label: "Blog Management",
    description: "Edit and organize posts",
    icon: NotebookPen,
  },
  {
    href: "/creator/library-editor",
    label: "Library Editor",
    description: "Add books and papers",
    icon: BookOpenText,
  },
  {
    href: "/creator/library-management",
    label: "Library Management",
    description: "Manage saved resources",
    icon: Library,
  },
  {
    href: "/creator/newsletter",
    label: "Newsletter",
    description: "Subscriber inbox",
    icon: Newspaper,
  },
  {
    href: "/creator/users",
    label: "User Management",
    description: "Roles and accounts",
    icon: Users,
  },
] as const;

export function CreatorShell({ children }: CreatorShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      window.dispatchEvent(new Event("auth-changed"));
      router.push("/");
      router.refresh();
      showToast({
        title: "Logged out",
        message: "You've been signed out successfully.",
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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="hidden w-[300px] shrink-0 border-r border-[var(--color-border)] bg-[rgba(253,252,240,0.88)] px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--color-text)]/45">
              Creator Space
            </p>
            <h1 className="mt-3 font-serif text-3xl text-[var(--color-text)]">
              Studio
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]/65">
              A quiet command center for publishing, managing, and shaping the
              entire site.
            </p>
          </div>

          <nav className="space-y-2">
            {creatorNav.map((item) => {
              const isActive =
                item.href === "/creator"
                  ? pathname === "/creator"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition-all ${
                    isActive
                      ? "border-[var(--color-accent)] bg-white/70 shadow-lg shadow-black/5"
                      : "border-transparent bg-transparent hover:border-[var(--color-border)] hover:bg-white/40"
                  }`}
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-[var(--color-text)]">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-[var(--color-text)]/55">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[rgba(253,252,240,0.86)] px-5 py-4 backdrop-blur-xl lg:px-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
                Private Dashboard
              </p>
              <h2 className="mt-1 font-serif text-xl text-[var(--color-text)]">
                Creator Control Panel
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/50 text-[var(--color-text)]/70 transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                aria-label="Back to site"
              >
                <Home className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/50 text-[var(--color-text)]/70 transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-5 py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

