"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/toastProvider";
import {
  LibraryManagementCard,
  type LibraryManagementItem,
} from "@/components/shared/creator/library-management/libraryManagementCard";

type ItemFilter =
  | "all"
  | "draft"
  | "published"
  | "featured"
  | "pinned"
  | "visible"
  | "textbook"
  | "paper"
  | "article"
  | "thesis"
  | "note"
  | "link";

type SortMode = "newest" | "oldest" | "featured" | "pinned" | "updated" | "priority";

const filterOptions: Array<{ label: string; value: ItemFilter }> = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Featured", value: "featured" },
  { label: "Pinned", value: "pinned" },
  { label: "Visible", value: "visible" },
  { label: "Textbook", value: "textbook" },
  { label: "Paper", value: "paper" },
  { label: "Article", value: "article" },
  { label: "Thesis", value: "thesis" },
  { label: "Note", value: "note" },
  { label: "Link", value: "link" },
];

const sortOptions: Array<{ label: string; value: SortMode }> = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Featured first", value: "featured" },
  { label: "Pinned first", value: "pinned" },
  { label: "Priority", value: "priority" },
  { label: "Last updated", value: "updated" },
];

function matchesFilter(item: LibraryManagementItem, filter: ItemFilter) {
  switch (filter) {
    case "draft":
      return item.status === "DRAFT";
    case "published":
      return item.status === "PUBLISHED";
    case "featured":
      return item.featured;
    case "pinned":
      return item.pinned;
    case "visible":
      return item.visible;
    case "textbook":
    case "paper":
    case "article":
    case "thesis":
    case "note":
    case "link":
      return item.itemType.toLowerCase() === filter;
    default:
      return true;
  }
}

function parseDate(value: string | null) {
  return value ? new Date(value) : null;
}

export function LibraryManagementShell() {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState<LibraryManagementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusyId, setIsBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ItemFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("featured");

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/library-items", {
        method: "GET",
        credentials: "include",
      });

      const data = (await response.json()) as { items?: LibraryManagementItem[]; message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to load library items.");
      }

      setItems(data.items ?? []);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Something went wrong while loading library items.";
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
      void loadItems();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadItems]);

  const visibleItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items
      .filter((item) => matchesFilter(item, filter))
      .filter((item) => {
        if (!normalizedSearch) {
          return true;
        }

        const authorNames = item.authors.map((author) => author.name).join(" ");
        const tagNames = item.tags.join(" ");

        return [
          item.title,
          item.slug,
          item.subject,
          item.publisher ?? "",
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
          case "pinned":
            return Number(right.pinned) - Number(left.pinned);
          case "priority":
            return (left.priority ?? Number.MAX_SAFE_INTEGER) - (right.priority ?? Number.MAX_SAFE_INTEGER);
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
  }, [filter, items, search, sortMode]);

  async function updateItem(item: LibraryManagementItem, nextStatus?: LibraryManagementItem["status"]) {
    setIsBusyId(item.id);

    try {
      const response = await fetch(`/api/library-items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...item,
          status: nextStatus ?? item.status,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to update the library item.");
      }

      showToast({
        title: "Library item updated",
        message: data.message ?? "The item has been updated.",
        variant: "success",
      });

      await loadItems();
    } catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Something went wrong while updating the library item.";
      showToast({
        title: "Update failed",
        message,
        variant: "error",
      });
    } finally {
      setIsBusyId(null);
    }
  }

  async function deleteItem(item: LibraryManagementItem) {
    const confirmDelete = window.confirm(
      `Delete "${item.title}"? This cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    setIsBusyId(item.id);

    try {
      const response = await fetch(`/api/library-items/${item.id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to delete the library item.");
      }

      showToast({
        title: "Library item deleted",
        message: data.message ?? "The item was removed.",
        variant: "success",
      });

      await loadItems();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Something went wrong while deleting the library item.";
      showToast({
        title: "Delete failed",
        message,
        variant: "error",
      });
    } finally {
      setIsBusyId(null);
    }
  }

  function openEditor(item: LibraryManagementItem) {
    router.push(`/creator/library-editor?itemId=${item.id}`);
  }

  function toggleStatus(item: LibraryManagementItem) {
    void updateItem(item, item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
  }

  function toggleFeatured(item: LibraryManagementItem) {
    void updateItem({ ...item, featured: !item.featured });
  }

  function togglePinned(item: LibraryManagementItem) {
    void updateItem({ ...item, pinned: !item.pinned });
  }

  const stats = [
    { label: "All items", value: items.length },
    { label: "Drafts", value: items.filter((item) => item.status === "DRAFT").length },
    { label: "Published", value: items.filter((item) => item.status === "PUBLISHED").length },
    { label: "Pinned", value: items.filter((item) => item.pinned).length },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--color-text)]/45">
              Creator / Library Management
            </p>
            <h1 className="mt-3 font-serif text-4xl text-[var(--color-text)]">
              Track textbooks, papers, and references in one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text)]/65">
              Search, sort, pin, feature, publish, and remove library items from a single control view.
            </p>
          </div>

          <button
            type="button"
            onClick={loadItems}
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
              placeholder="Search title, subject, author, tag..."
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
          Loading library items...
        </section>
      ) : visibleItems.length === 0 ? (
        <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 text-sm text-[var(--color-text)]/65 shadow-lg shadow-black/5 backdrop-blur-xl">
          No items match the current filters.
        </section>
      ) : (
        <div className="space-y-5">
          {visibleItems.map((item) => (
            <LibraryManagementCard
              key={item.id}
              item={item}
              isBusy={isBusyId === item.id}
              onEdit={openEditor}
              onToggleStatus={toggleStatus}
              onToggleFeatured={toggleFeatured}
              onTogglePinned={togglePinned}
              onDelete={deleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
