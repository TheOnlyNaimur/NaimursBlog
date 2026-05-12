"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, PencilLine, Save } from "lucide-react";
import { useToast } from "@/components/ui/toastProvider";
import {
  BlogPostPreviewModal,
  type BlogPreviewPost,
} from "@/components/shared/blog-preview/blogPostPreviewModal";
import { BlogEditorAuthorPanel } from "@/components/shared/creator/blog-editor/blogEditorAuthorPanel";
import { BlogEditorContentCanvas } from "@/components/shared/creator/blog-editor/blogEditorContentCanvas";
import { BlogEditorMetaPanel } from "@/components/shared/creator/blog-editor/blogEditorMetaPanel";
import { BlogEditorStatusPanel } from "@/components/shared/creator/blog-editor/blogEditorStatusPanel";

export type BlogAuthor = {
  id: string;
  name: string;
  role: string;
};

export type BlogEditorStatus = "draft" | "published";

const initialContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Start with a strong opening" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Use this canvas to build the article with text, images, YouTube embeds, and code blocks anywhere in the flow.",
        },
      ],
    },
  ],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeAuthors(authors: BlogAuthor[]) {
  return authors.map((author) => ({
    id: author.id,
    name: author.name.trim(),
    role: author.role.trim(),
  }));
}

function parsePostAuthors(value: unknown): BlogAuthor[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [
      { id: "primary-author", name: "Naimur Islam", role: "Primary Author" },
    ];
  }

  return value.map((author, index) => {
    if (author && typeof author === "object") {
      const candidate = author as Record<string, unknown>;

      return {
        id:
          typeof candidate.id === "string"
            ? candidate.id
            : `author-${index + 1}-${Date.now()}`,
        name: typeof candidate.name === "string" ? candidate.name : "",
        role: typeof candidate.role === "string" ? candidate.role : "",
      };
    }

    return {
      id: `author-${index + 1}-${Date.now()}`,
      name: "",
      role: "",
    };
  });
}

function parseContent(value: unknown) {
  if (value && typeof value === "object") {
    return value as JSONContent;
  }

  return initialContent;
}

export function BlogEditorShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingPostId = searchParams.get("postId");
  const { showToast } = useToast();
  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Technical");
  const [titleImage, setTitleImage] = useState("");
  const [technologyTags, setTechnologyTags] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [authors, setAuthors] = useState<BlogAuthor[]>([
    { id: "primary-author", name: "Naimur Islam", role: "Primary Author" },
    {
      id: "author-2",
      name: "Supervisor / Collaborator",
      role: "Optional co-author",
    },
  ]);
  const [status, setStatus] = useState<BlogEditorStatus>("draft");
  const [featured, setFeatured] = useState(false);
  const [keepInFeed, setKeepInFeed] = useState(true);
  const [feedOrder, setFeedOrder] = useState("01");
  const [content, setContent] = useState<JSONContent>(initialContent);
  const [editorKey, setEditorKey] = useState(0);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!editingPostId) {
      return;
    }

    let isActive = true;

    async function loadPost() {
      setIsLoadingPost(true);

      try {
        const response = await fetch(`/api/posts/${editingPostId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = (await response.json()) as {
          post?: {
            id: string;
            title: string;
            slug: string;
            category: string;
            titleImage?: string | null;
            technologyTags?: string[];
            authors?: unknown;
            publishDate?: string | null;
            status?: BlogEditorStatus;
            featured?: boolean;
            keepInFeed?: boolean;
            feedOrder?: number | null;
            content?: unknown;
          };
          message?: string;
        };

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to load the selected post.");
        }

        if (!isActive || !data.post) {
          return;
        }

        const post = data.post;

        setPostId(post.id);
        setTitle(post.title ?? "");
        setSlug(post.slug ?? "");
        setCategory(post.category ?? "Technical");
        setTitleImage(post.titleImage ?? "");
        setTechnologyTags((post.technologyTags ?? []).join(", "));
        setPublishDate(
          post.publishDate ? new Date(post.publishDate).toISOString().slice(0, 10) : ""
        );
        setAuthors(parsePostAuthors(post.authors));
        setStatus(post.status ?? "draft");
        setFeatured(Boolean(post.featured));
        setKeepInFeed(Boolean(post.keepInFeed));
        setFeedOrder(
          typeof post.feedOrder === "number" && Number.isFinite(post.feedOrder)
            ? String(post.feedOrder)
            : "01"
        );
        setContent(parseContent(post.content));
        setEditorKey((current) => current + 1);
      } catch (loadError) {
        showToast({
          title: "Load failed",
          message:
            loadError instanceof Error
              ? loadError.message
              : "Could not load the selected blog post.",
          variant: "error",
        });
      } finally {
        if (isActive) {
          setIsLoadingPost(false);
        }
      }
    }

    void loadPost();

    return () => {
      isActive = false;
    };
  }, [editingPostId, showToast]);

  const metadataSummary = useMemo(() => {
    return [
      title || "Untitled post",
      category,
      status === "published" ? "Published" : "Draft",
      featured ? "Featured" : "Not featured",
      keepInFeed ? "In feed" : "Not in feed",
    ].join(" | ");
  }, [category, featured, keepInFeed, status, title]);

  const previewPost = useMemo<BlogPreviewPost>(() => {
    const resolvedTitle = title.trim() || "Untitled post";
    const resolvedSlug = slug.trim() || slugify(resolvedTitle);

    return {
      title: resolvedTitle,
      slug: resolvedSlug,
      category,
      titleImage: titleImage.trim() || null,
      technologyTags: technologyTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      authors: normalizeAuthors(authors).map((author) => ({
        name: author.name,
        role: author.role,
      })),
      publishDate: publishDate.trim() || null,
      status,
      featured,
      keepInFeed,
      feedOrder: feedOrder.trim() ? Number.parseInt(feedOrder, 10) : null,
      content,
    };
  }, [
    authors,
    category,
    content,
    featured,
    feedOrder,
    keepInFeed,
    publishDate,
    slug,
    status,
    technologyTags,
    title,
    titleImage,
  ]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug.trim()) {
      setSlug(slugify(value));
    }
  }

  async function persistPost(nextStatus: BlogEditorStatus) {
    const resolvedTitle = title.trim();
    const resolvedSlug = slug.trim() || slugify(resolvedTitle);
    const resolvedCategory = category.trim();
    const resolvedPublishDate =
      publishDate.trim() || (nextStatus === "published" ? new Date().toISOString().slice(0, 10) : "");

    if (!resolvedTitle || !resolvedSlug || !resolvedCategory) {
      showToast({
        title: "Missing details",
        message: "Title, slug, and category are required before saving.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(postId ? `/api/posts/${postId}` : "/api/posts", {
        method: postId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: resolvedTitle,
          slug: resolvedSlug,
          category: resolvedCategory,
          titleImage: titleImage.trim(),
          technologyTags,
          authors: normalizeAuthors(authors),
          publishDate: resolvedPublishDate || null,
          status: nextStatus,
          featured,
          keepInFeed,
          feedOrder,
          content,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        post?: { id: string; slug: string };
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to save the post.");
      }

      if (data.post?.id) {
        setPostId(data.post.id);
      }

      setTitle(resolvedTitle);
      setSlug(resolvedSlug);
      setStatus(nextStatus);

      showToast({
        title: nextStatus === "published" ? "Post published" : postId ? "Draft updated" : "Draft saved",
        message: data.message ?? "Your post has been stored successfully.",
        variant: "success",
      });

      router.refresh();
    } catch (error) {
      showToast({
        title: "Save failed",
        message: error instanceof Error ? error.message : "Something went wrong while saving the post.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSaveDraft() {
    setStatus("draft");
    void persistPost("draft");
  }

  function handlePublish() {
    setStatus("published");
    void persistPost("published");
  }

  function handlePreviewOpen() {
    setIsPreviewOpen(true);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--color-text)]/45">
              Creator / Blog Editor
            </p>
            <h1 className="mt-3 font-serif text-4xl text-[var(--color-text)]">
              Compose a story, place media anywhere, and publish on your own
              terms.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text)]/65">
              Draft, feature, order, and publish posts with a structured editor
              built for text, images, videos, and code.
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/45">
              {metadataSummary}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePreviewOpen}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSubmitting && status === "draft" ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(214,169,117,0.25)] bg-[rgba(214,169,117,0.12)] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)] transition-colors hover:bg-[rgba(214,169,117,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PencilLine className="h-4 w-4" />
              {isSubmitting && status === "published" ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
        <div className="space-y-6">
          <BlogEditorMetaPanel
            title={title}
            slug={slug}
            category={category}
            titleImage={titleImage}
            technologyTags={technologyTags}
            publishDate={publishDate}
            onTitleChange={handleTitleChange}
            onSlugChange={setSlug}
            onCategoryChange={setCategory}
            onTitleImageChange={setTitleImage}
            onTechnologyTagsChange={setTechnologyTags}
            onPublishDateChange={setPublishDate}
          />
          <BlogEditorAuthorPanel authors={authors} onAuthorsChange={setAuthors} />
          <BlogEditorContentCanvas
            key={editorKey}
            initialContent={content}
            onContentChange={setContent}
          />
        </div>

        <aside className="space-y-6">
          <BlogEditorStatusPanel
            status={status}
            featured={featured}
            keepInFeed={keepInFeed}
            feedOrder={feedOrder}
            onStatusChange={setStatus}
            onFeaturedChange={setFeatured}
            onKeepInFeedChange={setKeepInFeed}
            onFeedOrderChange={setFeedOrder}
          />

          <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-5 shadow-lg shadow-black/5 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
              Editor Guide
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--color-text)]/65">
              <li>Write the post in structured blocks.</li>
              <li>Drop images and YouTube embeds anywhere.</li>
              <li>Keep the feed order in control from the sidebar.</li>
              <li>Use featured and draft states separately.</li>
            </ul>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-dark)]"
            >
              Open editor help
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </aside>
      </div>

      {isLoadingPost ? (
        <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.88)] p-4 text-sm text-[var(--color-text)]/65 shadow-lg shadow-black/5 backdrop-blur-xl">
          Loading existing post into the editor...
        </section>
      ) : null}

      <BlogPostPreviewModal
        isOpen={isPreviewOpen}
        post={previewPost}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}


