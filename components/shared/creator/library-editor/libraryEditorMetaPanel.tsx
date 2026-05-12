"use client";

type LibraryEditorMetaPanelProps = {
  title: string;
  slug: string;
  itemType: string;
  year: string;
  publisher: string;
  subject: string;
  tags: string;
  coverImage: string;
  resourceUrl: string;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onItemTypeChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onPublisherChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onCoverImageChange: (value: string) => void;
  onResourceUrlChange: (value: string) => void;
};

const typeOptions = ["TEXTBOOK", "PAPER", "ARTICLE", "THESIS", "NOTE", "LINK"] as const;

export function LibraryEditorMetaPanel({
  title,
  slug,
  itemType,
  year,
  publisher,
  subject,
  tags,
  coverImage,
  resourceUrl,
  onTitleChange,
  onSlugChange,
  onItemTypeChange,
  onYearChange,
  onPublisherChange,
  onSubjectChange,
  onTagsChange,
  onCoverImageChange,
  onResourceUrlChange,
}: LibraryEditorMetaPanelProps) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Metadata
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[var(--color-text)]">
            Library item details
          </h2>
        </div>

        <span className="rounded-full border border-[var(--color-border)] bg-white/50 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/55">
          Structured entry
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Title
          </span>
          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Enter the title"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Slug
          </span>
          <input
            value={slug}
            onChange={(event) => onSlugChange(event.target.value)}
            placeholder="library-item-slug"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Year
          </span>
          <input
            value={year}
            onChange={(event) => onYearChange(event.target.value)}
            placeholder="2026"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Publisher / Source
          </span>
          <input
            value={publisher}
            onChange={(event) => onPublisherChange(event.target.value)}
            placeholder="Publisher, journal, institution, or source"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Subject
          </span>
          <input
            value={subject}
            onChange={(event) => onSubjectChange(event.target.value)}
            placeholder="Machine learning, literature, history..."
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Tags
          </span>
          <input
            value={tags}
            onChange={(event) => onTagsChange(event.target.value)}
            placeholder="Research, Important, PDF"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Cover Image
          </span>
          <input
            value={coverImage}
            onChange={(event) => onCoverImageChange(event.target.value)}
            placeholder="Cover image URL"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Resource URL
          </span>
          <input
            value={resourceUrl}
            onChange={(event) => onResourceUrlChange(event.target.value)}
            placeholder="PDF, website, or article link"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {typeOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onItemTypeChange(option)}
            className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors ${
              itemType === option
                ? "border-[var(--color-accent)] bg-[rgba(214,169,117,0.16)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] bg-white/55 text-[var(--color-text)]/65 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
