"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, PencilLine, Save } from "lucide-react";
import { useToast } from "@/components/ui/toastProvider";
import {
  LibraryEditorAuthorsPanel,
  type LibraryEditorAuthor,
} from "@/components/shared/creator/library-editor/libraryEditorAuthorsPanel";
import { LibraryEditorMetaPanel } from "@/components/shared/creator/library-editor/libraryEditorMetaPanel";
import { LibraryEditorNotesPanel } from "@/components/shared/creator/library-editor/libraryEditorNotesPanel";
import { LibraryEditorStatusPanel } from "@/components/shared/creator/library-editor/libraryEditorStatusPanel";

type LibraryItemStatus = "draft" | "published";
type LibraryItemType = "TEXTBOOK" | "PAPER" | "ARTICLE" | "THESIS" | "NOTE" | "LINK";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeAuthors(authors: LibraryEditorAuthor[]) {
  return authors
    .map((author) => ({
      id: author.id,
      name: author.name.trim(),
    }))
    .filter((author) => author.name);
}

function parseAuthors(value: unknown): LibraryEditorAuthor[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [{ id: "primary-author", name: "Naimur Islam" }];
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
      };
    }

    return {
      id: `author-${index + 1}-${Date.now()}`,
      name: "",
    };
  });
}

export function LibraryEditorShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingItemId = searchParams.get("itemId");
  const { showToast } = useToast();

  const [itemId, setItemId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [itemType, setItemType] = useState<LibraryItemType>("TEXTBOOK");
  const [authors, setAuthors] = useState<LibraryEditorAuthor[]>([
    { id: "primary-author", name: "Naimur Islam" },
  ]);
  const [year, setYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<LibraryItemStatus>("draft");
  const [featured, setFeatured] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [visible, setVisible] = useState(true);
  const [priority, setPriority] = useState("01");
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!editingItemId) {
      return;
    }

    let isActive = true;

    async function loadItem() {
      setIsLoadingItem(true);

      try {
        const response = await fetch(`/api/library-items/${editingItemId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = (await response.json()) as {
          item?: {
            id: string;
            title: string;
            slug: string;
            itemType: LibraryItemType;
            authors?: unknown;
            year?: number | null;
            publisher?: string | null;
            subject?: string;
            tags?: string[];
            coverImage?: string | null;
            resourceUrl?: string | null;
            notes?: string;
            status?: LibraryItemStatus;
            featured?: boolean;
            pinned?: boolean;
            visible?: boolean;
            priority?: number | null;
          };
          message?: string;
        };

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to load the selected library item.");
        }

        if (!isActive || !data.item) {
          return;
        }

        const item = data.item;

        setItemId(item.id);
        setTitle(item.title ?? "");
        setSlug(item.slug ?? "");
        setItemType(item.itemType ?? "TEXTBOOK");
        setAuthors(parseAuthors(item.authors));
        setYear(typeof item.year === "number" ? String(item.year) : "");
        setPublisher(item.publisher ?? "");
        setSubject(item.subject ?? "");
        setTags((item.tags ?? []).join(", "));
        setCoverImage(item.coverImage ?? "");
        setResourceUrl(item.resourceUrl ?? "");
        setNotes(item.notes ?? "");
        setStatus(item.status ?? "draft");
        setFeatured(Boolean(item.featured));
        setPinned(Boolean(item.pinned));
        setVisible(item.visible !== false);
        setPriority(
          typeof item.priority === "number" && Number.isFinite(item.priority)
            ? String(item.priority)
            : "01"
        );
      } catch (loadError) {
        showToast({
          title: "Load failed",
          message:
            loadError instanceof Error
              ? loadError.message
              : "Could not load the selected library item.",
          variant: "error",
        });
      } finally {
        if (isActive) {
          setIsLoadingItem(false);
        }
      }
    }

    void loadItem();

    return () => {
      isActive = false;
    };
  }, [editingItemId, showToast]);

  const summary = useMemo(() => {
    return [
      title || "Untitled item",
      itemType,
      status === "published" ? "Published" : "Draft",
      featured ? "Featured" : "Not featured",
      pinned ? "Pinned" : "Not pinned",
    ].join(" | ");
  }, [featured, itemType, pinned, status, title]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug.trim()) {
      setSlug(slugify(value));
    }
  }

  async function persistItem(nextStatus: LibraryItemStatus) {
    const resolvedTitle = title.trim();
    const resolvedSlug = slug.trim() || slugify(resolvedTitle);
    const resolvedSubject = subject.trim();
    const resolvedNotes = notes.trim();

    if (!resolvedTitle || !resolvedSlug || !resolvedSubject || !resolvedNotes) {
      showToast({
        title: "Missing details",
        message: "Title, slug, subject, and notes are required before saving.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(itemId ? `/api/library-items/${itemId}` : "/api/library-items", {
        method: itemId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: resolvedTitle,
          slug: resolvedSlug,
          itemType,
          authors: normalizeAuthors(authors),
          year: year.trim() || null,
          publisher: publisher.trim() || null,
          subject: resolvedSubject,
          tags,
          coverImage: coverImage.trim() || null,
          resourceUrl: resourceUrl.trim() || null,
          notes: resolvedNotes,
          status: nextStatus,
          featured,
          pinned,
          visible,
          priority: priority.trim() || null,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        item?: { id: string; slug: string };
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to save the library item.");
      }

      if (data.item?.id) {
        setItemId(data.item.id);
      }

      setTitle(resolvedTitle);
      setSlug(resolvedSlug);
      setStatus(nextStatus);

      showToast({
        title:
          nextStatus === "published"
            ? "Library item published"
            : itemId
              ? "Library item updated"
              : "Library item saved",
        message: data.message ?? "Your resource has been stored successfully.",
        variant: "success",
      });

      router.refresh();
    } catch (error) {
      showToast({
        title: "Save failed",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while saving the library item.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSaveDraft() {
    setStatus("draft");
    void persistItem("draft");
  }

  function handlePublish() {
    setStatus("published");
    void persistItem("published");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--color-text)]/45">
              Creator / Library Editor
            </p>
            <h1 className="mt-3 font-serif text-4xl text-[var(--color-text)]">
              Store books, papers, and important references in one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text)]/65">
              Keep the library structured with type, authors, subject, notes, and visibility controls.
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/45">
              {summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
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
          <LibraryEditorMetaPanel
            title={title}
            slug={slug}
            itemType={itemType}
            year={year}
            publisher={publisher}
            subject={subject}
            tags={tags}
            coverImage={coverImage}
            resourceUrl={resourceUrl}
            onTitleChange={handleTitleChange}
            onSlugChange={setSlug}
            onItemTypeChange={(value) => setItemType(value as LibraryItemType)}
            onYearChange={setYear}
            onPublisherChange={setPublisher}
            onSubjectChange={setSubject}
            onTagsChange={setTags}
            onCoverImageChange={setCoverImage}
            onResourceUrlChange={setResourceUrl}
          />
          <LibraryEditorAuthorsPanel authors={authors} onAuthorsChange={setAuthors} />
          <LibraryEditorNotesPanel notes={notes} onNotesChange={setNotes} />
        </div>

        <aside className="space-y-6">
          <LibraryEditorStatusPanel
            status={status}
            featured={featured}
            pinned={pinned}
            visible={visible}
            priority={priority}
            onStatusChange={setStatus}
            onFeaturedChange={setFeatured}
            onPinnedChange={setPinned}
            onVisibleChange={setVisible}
            onPriorityChange={setPriority}
          />

          <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-5 shadow-lg shadow-black/5 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
              Quick guide
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--color-text)]/65">
              <li>Keep the entry short and structured.</li>
              <li>Use notes for summaries and takeaways.</li>
              <li>Mark important items as featured or pinned.</li>
              <li>Use the priority number to control order.</li>
            </ul>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-dark)]"
            >
              Open library help
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </aside>
      </div>

      {isLoadingItem ? (
        <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.88)] p-4 text-sm text-[var(--color-text)]/65 shadow-lg shadow-black/5 backdrop-blur-xl">
          Loading existing library item...
        </section>
      ) : null}
    </div>
  );
}
