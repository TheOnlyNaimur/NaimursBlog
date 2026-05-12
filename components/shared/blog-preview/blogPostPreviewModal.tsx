"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect } from "react";
import type { JSONContent } from "@tiptap/core";
import type { ReactNode } from "react";
import { CalendarDays, Clock3, MapPin, X } from "lucide-react";

type PreviewMark = {
  type?: string;
  attrs?: Record<string, unknown>;
};

type PreviewNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: PreviewNode[];
  text?: string;
  marks?: PreviewMark[];
};

export type BlogPreviewAuthor = {
  name: string;
  role: string;
};

export type BlogPreviewPost = {
  title: string;
  slug: string;
  category: string;
  titleImage?: string | null;
  technologyTags?: string[];
  authors?: BlogPreviewAuthor[];
  publishDate?: string | null;
  status?: string;
  featured?: boolean;
  keepInFeed?: boolean;
  feedOrder?: number | null;
  content?: JSONContent | null;
  updatedAt?: string;
};

type BlogPostPreviewModalProps = {
  post: BlogPreviewPost | null;
  isOpen: boolean;
  onClose: () => void;
};

function isPreviewNode(value: unknown): value is PreviewNode {
  return Boolean(value && typeof value === "object");
}

function toPreviewNodes(content: unknown): PreviewNode[] {
  if (!isPreviewNode(content)) {
    return [];
  }

  const candidate = content as PreviewNode;

  if (candidate.type === "doc") {
    return Array.isArray(candidate.content) ? candidate.content : [];
  }

  return [candidate];
}

function getAlignStyle(node: PreviewNode) {
  const textAlign = node.attrs?.textAlign;

  if (
    textAlign === "left" ||
    textAlign === "center" ||
    textAlign === "right" ||
    textAlign === "justify"
  ) {
    return { textAlign };
  }

  return undefined;
}

function renderMarks(children: ReactNode, marks?: PreviewMark[]) {
  if (!marks?.length) {
    return children;
  }

  return marks.reduceRight((accumulator, mark, index) => {
    switch (mark.type) {
      case "bold":
        return <strong key={`${mark.type}-${index}`}>{accumulator}</strong>;
      case "italic":
        return <em key={`${mark.type}-${index}`}>{accumulator}</em>;
      case "underline":
        return <u key={`${mark.type}-${index}`}>{accumulator}</u>;
      case "strike":
        return <s key={`${mark.type}-${index}`}>{accumulator}</s>;
      case "link": {
        const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";

        return (
          <a
            key={`${mark.type}-${index}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-accent)] underline decoration-[rgba(214,169,117,0.42)] underline-offset-4"
          >
            {accumulator}
          </a>
        );
      }
      default:
        return accumulator;
    }
  }, children);
}

function renderNode(node: PreviewNode, key: string): React.ReactNode {
  const children = Array.isArray(node.content)
    ? node.content.map((child, index) => renderNode(child, `${key}-${index}`))
    : [];

  switch (node.type) {
    case "doc":
      return (
        <div key={key} className="space-y-6">
          {children}
        </div>
      );

    case "heading": {
      const level = typeof node.attrs?.level === "number" ? node.attrs.level : 2;
      const HeadingTag = (`h${Math.min(Math.max(level, 1), 3)}` as const);
      const headingClasses = {
        1: "font-serif text-4xl leading-tight text-[var(--color-text)]",
        2: "font-serif text-3xl leading-tight text-[var(--color-text)]",
        3: "font-serif text-2xl leading-tight text-[var(--color-text)]",
      }[Math.min(Math.max(level, 1), 3)];

      return (
        <HeadingTag key={key} style={getAlignStyle(node)} className={headingClasses}>
          {children}
        </HeadingTag>
      );
    }

    case "paragraph":
      return (
        <p
          key={key}
          style={getAlignStyle(node)}
          className="text-[16px] leading-8 text-[var(--color-text)]/78"
        >
          {children}
        </p>
      );

    case "blockquote":
      return (
        <blockquote
          key={key}
          style={getAlignStyle(node)}
          className="border-l-4 border-[rgba(214,169,117,0.5)] bg-[rgba(214,169,117,0.08)] px-5 py-4 text-[16px] leading-8 text-[var(--color-text)]/80 italic"
        >
          {children}
        </blockquote>
      );

    case "bulletList":
      return (
        <ul
          key={key}
          className="space-y-3 pl-6 text-[16px] leading-8 text-[var(--color-text)]/78"
        >
          {children}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={key}
          className="space-y-3 pl-6 text-[16px] leading-8 text-[var(--color-text)]/78"
        >
          {children}
        </ol>
      );

    case "listItem":
      return <li key={key}>{children}</li>;

    case "codeBlock":
      return (
        <pre
          key={key}
          className="overflow-x-auto rounded-3xl border border-[rgba(47,36,28,0.12)] bg-[#1d1815] p-5 text-sm leading-7 text-[#f7efe7]"
        >
          <code>{children}</code>
        </pre>
      );

    case "horizontalRule":
      return <hr key={key} className="border-[var(--color-border)]" />;

    case "hardBreak":
      return <br key={key} />;

    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "Article image";
      const title = typeof node.attrs?.title === "string" ? node.attrs.title : "";

      if (!src) {
        return null;
      }

      return (
        <figure key={key} className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white/70">
          <img src={src} alt={alt} title={title} className="h-auto w-full object-cover" />
        </figure>
      );
    }

    case "youtube": {
      const src =
        typeof node.attrs?.src === "string"
          ? node.attrs.src
          : typeof node.attrs?.videoId === "string"
            ? `https://www.youtube.com/embed/${node.attrs.videoId}`
            : "";

      if (!src) {
        return null;
      }

      return (
        <div key={key} className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-black shadow-lg shadow-black/10">
          <div className="aspect-video w-full">
            <iframe
              src={src}
              title="Embedded video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      );
    }

    case "text":
      return renderMarks(node.text ?? "", node.marks);

    default:
      return children.length ? <div key={key}>{children}</div> : null;
  }
}

function formatStatus(status?: string) {
  return status?.toLowerCase() === "published" ? "Published" : "Draft";
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostPreviewModal({
  post,
  isOpen,
  onClose,
}: BlogPostPreviewModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) {
    return null;
  }

  const previewAuthors = post.authors?.filter((author) => author.name.trim()) ?? [];
  const previewTags = (post.technologyTags ?? []).filter(Boolean);
  const statusLabel = formatStatus(post.status);
  const bodyNodes = toPreviewNodes(post.content);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(19,14,11,0.72)] px-3 py-3 backdrop-blur-md">
      <div className="relative flex h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(253,252,240,0.98)] shadow-2xl shadow-black/25">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[rgba(253,252,240,0.96)] px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-text)]/45">
              Reader preview
            </p>
            <h2 className="mt-1 font-serif text-2xl text-[var(--color-text)]">
              This is how the post will look
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/75 text-[var(--color-text)]/60 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-1 gap-0 overflow-hidden lg:grid-cols-[minmax(0,1.7fr)_320px]">
          <article className="overflow-y-auto px-5 py-5 lg:px-8 lg:py-8">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--color-border)] bg-white/75 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/60">
                  {post.category}
                </span>
                <span className="rounded-full border border-[var(--color-border)] bg-white/75 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/60">
                  {statusLabel}
                </span>
                {post.featured ? (
                  <span className="rounded-full border border-[rgba(214,169,117,0.28)] bg-[rgba(214,169,117,0.12)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    Featured
                  </span>
                ) : null}
              </div>

              <h1 className="font-serif text-4xl leading-tight text-[var(--color-text)] lg:text-5xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text)]/62">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(post.publishDate)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  Feed order {post.feedOrder ?? "—"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {post.keepInFeed ? "Shown on homepage feed" : "Blog only"}
                </span>
              </div>

              {post.titleImage ? (
                <figure className="overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-white/75 shadow-lg shadow-black/5">
                  <img
                    src={post.titleImage}
                    alt={post.title}
                    className="h-auto w-full object-cover"
                  />
                </figure>
              ) : null}

              <div className="prose max-w-none prose-headings:font-serif prose-headings:text-[var(--color-text)] prose-p:text-[var(--color-text)]/80 prose-p:leading-8 prose-strong:text-[var(--color-text)] prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline">
                <div className="space-y-6">
                  {bodyNodes.length ? (
                    bodyNodes.map((node, index) => renderNode(node, `preview-${index}`))
                  ) : (
                    <p className="text-[16px] leading-8 text-[var(--color-text)]/70">
                      No content has been written yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/75 p-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
                  Technology Tags
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {previewTags.length ? (
                    previewTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[rgba(214,169,117,0.22)] bg-[rgba(214,169,117,0.1)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/65"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)]/55">
                      No technology tags
                    </span>
                  )}
                </div>
              </div>
            </div>
          </article>

          <aside className="border-t border-[var(--color-border)] bg-[rgba(253,252,240,0.82)] px-5 py-5 lg:border-l lg:border-t-0 lg:px-5 lg:py-8">
            <div className="space-y-5">
              <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/75 p-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
                  Authors
                </p>
                <div className="mt-3 space-y-3">
                  {previewAuthors.length ? (
                    previewAuthors.map((author) => (
                      <div key={`${author.name}-${author.role}`} className="rounded-2xl border border-[var(--color-border)] bg-white/65 px-4 py-3">
                        <p className="font-medium text-[var(--color-text)]">{author.name}</p>
                        <p className="mt-1 text-sm text-[var(--color-text)]/60">{author.role}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--color-text)]/60">No authors added yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/75 p-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
                  Post Details
                </p>
                <dl className="mt-3 space-y-3 text-sm text-[var(--color-text)]/70">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-[var(--color-text)]/45">Slug</dt>
                    <dd className="text-right">/{post.slug}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-[var(--color-text)]/45">Visibility</dt>
                    <dd className="text-right">
                      {post.status?.toLowerCase() === "published" ? "Public" : "Draft"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-[var(--color-text)]/45">Feed</dt>
                    <dd className="text-right">
                      {post.keepInFeed ? "Included in homepage feed" : "Hidden from homepage feed"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-[var(--color-text)]/45">Updated</dt>
                    <dd className="text-right">
                      {post.updatedAt ? formatDate(post.updatedAt) : "Unknown"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[rgba(214,169,117,0.08)] p-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
                  Editorial note
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text)]/70">
                  This preview uses the same reader-style layout we can later reuse on the public blog page, so the editor and the public view stay aligned.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
