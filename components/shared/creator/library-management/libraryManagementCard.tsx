"use client";

import { Edit3, EyeOff, Eye, Pin, Star, Trash2, BookOpen } from "lucide-react";
import type { ReactNode } from "react";

export type LibraryManagementAuthor = {
  id: string;
  name: string;
};

export type LibraryManagementItem = {
  id: string;
  title: string;
  slug: string;
  itemType: string;
  authors: LibraryManagementAuthor[];
  year: number | null;
  publisher: string | null;
  subject: string;
  tags: string[];
  coverImage: string | null;
  resourceUrl: string | null;
  notes: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  pinned: boolean;
  visible: boolean;
  priority: number | null;
  updatedAt: string;
  publishedAt: string | null;
};

type ActionButtonProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  tone?: "default" | "accent" | "danger";
  disabled?: boolean;
};

function ActionButton({
  label,
  icon,
  onClick,
  tone = "default",
  disabled = false,
}: ActionButtonProps) {
  const toneClasses = {
    default:
      "border-[var(--color-border)] bg-white/70 text-[var(--color-text)]/68 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
    accent:
      "border-[rgba(214,169,117,0.25)] bg-[rgba(214,169,117,0.12)] text-[var(--color-text)] hover:bg-[rgba(214,169,117,0.18)]",
    danger:
      "border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses}`}
    >
      {icon}
      {label}
    </button>
  );
}

type LibraryManagementCardProps = {
  item: LibraryManagementItem;
  isBusy?: boolean;
  onEdit: (item: LibraryManagementItem) => void;
  onToggleStatus: (item: LibraryManagementItem) => void;
  onToggleFeatured: (item: LibraryManagementItem) => void;
  onTogglePinned: (item: LibraryManagementItem) => void;
  onDelete: (item: LibraryManagementItem) => void;
};

export function LibraryManagementCard({
  item,
  isBusy = false,
  onEdit,
  onToggleStatus,
  onToggleFeatured,
  onTogglePinned,
  onDelete,
}: LibraryManagementCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] shadow-lg shadow-black/5 backdrop-blur-xl">
      <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="relative min-h-52 bg-[rgba(214,169,117,0.1)]">
          {item.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <div>
                <BookOpen className="mx-auto h-10 w-10 text-[var(--color-accent)]/60" />
                <p className="mt-3 text-sm text-[var(--color-text)]/60">No cover image</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(47,36,28,0.38)] via-transparent to-transparent" />
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
                {item.itemType}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[var(--color-text)]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]/65">
                /{item.slug}
              </p>
              <p className="mt-2 text-sm text-[var(--color-text)]/60">
                {item.subject}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ActionButton
                label="Edit"
                icon={<Edit3 className="h-4 w-4" />}
                onClick={() => onEdit(item)}
                tone="accent"
                disabled={isBusy}
              />
              <ActionButton
                label={item.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                icon={item.status === "PUBLISHED" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onClick={() => onToggleStatus(item)}
                disabled={isBusy}
              />
              <ActionButton
                label={item.featured ? "Unfeature" : "Feature"}
                icon={<Star className="h-4 w-4" />}
                onClick={() => onToggleFeatured(item)}
                disabled={isBusy}
              />
              <ActionButton
                label={item.pinned ? "Unpin" : "Pin"}
                icon={<Pin className="h-4 w-4" />}
                onClick={() => onTogglePinned(item)}
                disabled={isBusy}
              />
              <ActionButton
                label="Delete"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => onDelete(item)}
                tone="danger"
                disabled={isBusy}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/60">
              Year: {item.year ?? "—"}
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/60">
              Priority: {item.priority ?? "—"}
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/60">
              Updated {new Date(item.updatedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.tags.length ? (
              item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[rgba(214,169,117,0.22)] bg-[rgba(214,169,117,0.1)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/65"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/55">
                No tags
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
            <div className="text-sm text-[var(--color-text)]/65">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/45">
                Authors
              </p>
              <p className="mt-1">
                {item.authors.map((author) => author.name).filter(Boolean).join(", ") ||
                  "No authors"}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent)]">
              {item.visible ? "Visible" : "Hidden"} · {item.featured ? "Featured" : "Normal"} ·{" "}
              {item.pinned ? "Pinned" : "Loose"}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
