"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useToast } from "@/components/ui/toastProvider";
import {
  BlogPostPreviewModal,
} from "@/components/shared/blog-preview/blogPostPreviewModal";
import {
  BlogManagementPostCard,
  type BlogManagementPost,
} from "@/components/shared/creator/blog-management/blogManagementPostCard";

type PostFilter =
  | "all"
  | "draft"
  | "published"
  | "featured"
  | "feed"
  | "technical"
  | "general"
  | "documentation";

type SortMode = "newest" | "oldest" | "featured" | "feed" | "updated";

const filterOptions: Array<{ label: string; value: PostFilter }> = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Featured", value: "featured" },
  { label: "Feed", value: "feed" },
  { label: "Technical", value: "technical" },
  { label: "General", value: "general" },
  { label: "Documentation", value: "documentation" },
];

const sortOptions: Array<{ label: string; value: SortMode }> = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Featured first", value: "featured" },
  { label: "Feed order", value: "feed" },
  { label: "Last updated", value: "updated" },
];

function matchesFilter(post: BlogManagementPost, filter: PostFilter) {
  switch (filter) {
    case "draft":
      return post.status === "DRAFT";
    case "published":
      return post.status === "PUBLISHED";
    case "featured":
      return post.featured;
    case "feed":
      return post.keepInFeed;
    case "technical":
    case "general":
    case "documentation":
      return post.category.toLowerCase() === filter;
    default:
      return true;
  }
}

function parseDate(value: string | null) {
  return value ? new Date(value) : null;
}

function formatTags(tags: string[]) {
  return tags.filter(Boolean);
}

function buildPayload(post: BlogManagementPost, nextStatus?: BlogManagementPost["status"]) {
  return {
    title: post.title,
    slug: post.slug,
    category: post.category,
    titleImage: post.titleImage,
    technologyTags: formatTags(post.technologyTags),
    authors: post.authors,
    publishDate: post.publishDate,
    status: nextStatus ?? post.status,
    featured: post.featured,
    keepInFeed: post.keepInFeed,
    feedOrder: post.feedOrder,
    content: post.content,
  };
}

export function BlogManagementShell() {
  const router = useRouter();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogManagementPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusyId, setIsBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PostFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [selectedPost, setSelectedPost] = useState<BlogManagementPost | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "GET",
        credentials: "include",
      });

      const data = (await response.json()) as { posts?: BlogManagementPost[]; message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to load posts.");
      }

      setPosts(data.posts ?? []);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Something went wrong while loading blog posts.";
      setError(message);
      showToast({
        title: "Load failed",
        message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPosts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadPosts]);

  const visiblePosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return posts
      .filter((post) => matchesFilter(post, filter))
      .filter((post) => {
        if (!normalizedSearch) {
          return true;
        }

        const authorNames = post.authors.map((author) => author.name).join(" ");
        const tagNames = post.technologyTags.join(" ");

        return [
          post.title,
          post.slug,
          post.category,
          authorNames,
          tagNames,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((left, right) => {
        switch (sortMode) {
          case "oldest":
            return (
              parseDate(left.createdAt)?.getTime() ?? 0
            ) - (parseDate(right.createdAt)?.getTime() ?? 0);
          case "featured":
            return Number(right.featured) - Number(left.featured);
          case "feed":
            return (left.feedOrder ?? Number.MAX_SAFE_INTEGER) - (right.feedOrder ?? Number.MAX_SAFE_INTEGER);
          case "updated":
            return (
              parseDate(right.updatedAt)?.getTime() ?? 0
            ) - (parseDate(left.updatedAt)?.getTime() ?? 0);
          case "newest":
          default:
            return (
              parseDate(right.createdAt)?.getTime() ?? 0
            ) - (parseDate(left.createdAt)?.getTime() ?? 0);
        }
      });
  }, [filter, posts, search, sortMode]);

  async function updatePost(post: BlogManagementPost, nextStatus?: BlogManagementPost["status"]) {
    setIsBusyId(post.id);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload(post, nextStatus)),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to update the post.");
      }

      showToast({
        title: "Post updated",
        message: data.message ?? "The post has been updated.",
        variant: "success",
      });

      await loadPosts();
    } catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Something went wrong while updating the post.";
      showToast({
        title: "Update failed",
        message,
        variant: "error",
      });
    } finally {
      setIsBusyId(null);
    }
  }

  async function deletePost(post: BlogManagementPost) {
    const confirmDelete = window.confirm(
      `Delete "${post.title}"? This cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    setIsBusyId(post.id);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to delete the post.");
      }

      showToast({
        title: "Post deleted",
        message: data.message ?? "The post was removed.",
        variant: "success",
      });

      await loadPosts();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Something went wrong while deleting the post.";
      showToast({
        title: "Delete failed",
        message,
        variant: "error",
      });
    } finally {
      setIsBusyId(null);
    }
  }

  function openEditor(post: BlogManagementPost) {
    router.push(`/creator/blog-editor?postId=${post.id}`);
  }

  function openPreview(post: BlogManagementPost) {
    setSelectedPost(post);
  }

  function closePreview() {
    setSelectedPost(null);
  }

  function toggleStatus(post: BlogManagementPost) {
    void updatePost(post, post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
  }

  function toggleFeatured(post: BlogManagementPost) {
    void updatePost({ ...post, featured: !post.featured });
  }

  function toggleFeed(post: BlogManagementPost) {
    void updatePost({ ...post, keepInFeed: !post.keepInFeed });
  }

  const stats = [
    { label: "All posts", value: posts.length },
    { label: "Drafts", value: posts.filter((post) => post.status === "DRAFT").length },
    { label: "Published", value: posts.filter((post) => post.status === "PUBLISHED").length },
    { label: "Featured", value: posts.filter((post) => post.featured).length },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--color-text)]/45">
              Creator / Blog Management
            </p>
            <h1 className="mt-3 font-serif text-4xl text-[var(--color-text)]">
              Keep every post in view, edit fast, and control the feed.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text)]/65">
              Search, sort, publish, feature, and remove posts without leaving the control room.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPosts}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--color-border)] bg-white/65 px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/45">
                {item.label}
              </p>
              <p className="mt-2 font-serif text-3xl text-[var(--color-text)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-5 shadow-lg shadow-black/5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3">
            <Search className="h-4 w-4 text-[var(--color-text)]/45" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, slug, author, tag..."
              className="w-full bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors ${
                  filter === option.value
                    ? "border-[var(--color-accent)] bg-[rgba(214,169,117,0.14)] text-[var(--color-accent)]"
                    : "border-[var(--color-border)] bg-white/60 text-[var(--color-text)]/60 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/70 px-3 py-2">
            <Filter className="h-4 w-4 text-[var(--color-text)]/45" />
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="bg-transparent text-[10px] uppercase tracking-[0.22em] text-[var(--color-text)] outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="h-4 w-4 text-[var(--color-text)]/45" />
          </div>
        </div>
      </section>

      {error ? (
        <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-900">
          {error}
        </section>
      ) : null}

      {isLoading ? (
        <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 text-sm text-[var(--color-text)]/65 shadow-lg shadow-black/5 backdrop-blur-xl">
          Loading blog posts...
        </section>
      ) : visiblePosts.length === 0 ? (
        <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 text-sm text-[var(--color-text)]/65 shadow-lg shadow-black/5 backdrop-blur-xl">
          No posts match the current filters.
        </section>
      ) : (
        <div className="space-y-5">
          {visiblePosts.map((post) => (
            <BlogManagementPostCard
              key={post.id}
              post={post}
              isBusy={isBusyId === post.id}
              onPreview={openPreview}
              onEdit={openEditor}
              onToggleStatus={toggleStatus}
              onToggleFeatured={toggleFeatured}
              onToggleFeed={toggleFeed}
              onDelete={deletePost}
            />
          ))}
        </div>
      )}

      <BlogPostPreviewModal
        isOpen={Boolean(selectedPost)}
        post={selectedPost}
        onClose={closePreview}
      />
    </div>
  );
}
