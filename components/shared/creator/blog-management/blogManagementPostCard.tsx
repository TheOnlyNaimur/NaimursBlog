"use client";

import Image from "next/image";
import type { JSONContent } from "@tiptap/core";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Edit3,
  Eye,
  EyeOff,
  Folder,
  Pin,
  Star,
  Trash2,
} from "lucide-react";

export type BlogManagementAuthor = {
  id: string;
  name: string;
  role: string;
};

export type BlogManagementPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  titleImage: string | null;
  technologyTags: string[];
  authors: BlogManagementAuthor[];
  publishDate: string | null;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  keepInFeed: boolean;
  feedOrder: number | null;
  updatedAt: string;
  publishedAt: string | null;
  createdAt: string;
  content: JSONContent | null;
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

type BlogManagementPostCardProps = {
  post: BlogManagementPost;
  onPreview: (post: BlogManagementPost) => void;
  onEdit: (post: BlogManagementPost) => void;
  onToggleStatus: (post: BlogManagementPost) => void;
  onToggleFeatured: (post: BlogManagementPost) => void;
  onToggleFeed: (post: BlogManagementPost) => void;
  onDelete: (post: BlogManagementPost) => void;
  isBusy?: boolean;
};

export function BlogManagementPostCard({
  post,
  onPreview,
  onEdit,
  onToggleStatus,
  onToggleFeatured,
  onToggleFeed,
  onDelete,
  isBusy = false,
}: BlogManagementPostCardProps) {
  const primaryAuthor = post.authors.find((author) => author.name.trim())?.name ?? "Untitled author";

  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] shadow-lg shadow-black/5 backdrop-blur-xl">
      <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="relative min-h-56 bg-[rgba(214,169,117,0.1)]">
          {post.titleImage ? (
            <Image src={post.titleImage} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 280px" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <div>
                <Folder className="mx-auto h-10 w-10 text-[var(--color-accent)]/60" />
                <p className="mt-3 text-sm text-[var(--color-text)]/60">
                  No cover image
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(47,36,28,0.38)] via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-[rgba(47,36,28,0.65)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white">
              {post.status === "PUBLISHED" ? "Published" : "Draft"}
            </span>
            {post.featured ? (
              <span className="rounded-full border border-white/20 bg-[rgba(214,169,117,0.8)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white">
                Featured
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
                {post.category}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[var(--color-text)]">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]/65">
                /{post.slug}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ActionButton
                label="Edit"
                icon={<Edit3 className="h-4 w-4" />}
                onClick={() => onEdit(post)}
                tone="accent"
                disabled={isBusy}
              />
              <ActionButton
                label={post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                icon={post.status === "PUBLISHED" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onClick={() => onToggleStatus(post)}
                disabled={isBusy}
              />
              <ActionButton
                label={post.featured ? "Unfeature" : "Feature"}
                icon={<Star className="h-4 w-4" />}
                onClick={() => onToggleFeatured(post)}
                disabled={isBusy}
              />
              <ActionButton
                label={post.keepInFeed ? "Remove feed" : "Keep in feed"}
                icon={<Pin className="h-4 w-4" />}
                onClick={() => onToggleFeed(post)}
                disabled={isBusy}
              />
              <ActionButton
                label="Delete"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => onDelete(post)}
                tone="danger"
                disabled={isBusy}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/60">
              Author: {primaryAuthor}
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/60">
              Feed order: {post.feedOrder ?? "—"}
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/60">
              Updated {new Date(post.updatedAt).toLocaleDateString()}
            </span>
            {post.publishedAt ? (
              <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/60">
                Published {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {post.technologyTags.length ? (
              post.technologyTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[rgba(214,169,117,0.22)] bg-[rgba(214,169,117,0.1)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/65"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/55">
                No tech tags
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
            <div className="text-sm text-[var(--color-text)]/65">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/45">
                Authors
              </p>
              <p className="mt-1">{post.authors.map((author) => author.name).filter(Boolean).join(", ") || "No authors"}</p>
            </div>

            <button
              type="button"
              onClick={() => onPreview(post)}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-dark)]"
            >
              Preview post
              <Eye className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onEdit(post)}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-dark)]"
            >
              Open in editor
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
