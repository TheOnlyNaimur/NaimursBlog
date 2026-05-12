type BlogEditorMetaPanelProps = {
  title: string;
  slug: string;
  category: string;
  titleImage: string;
  technologyTags: string;
  publishDate: string;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTitleImageChange: (value: string) => void;
  onTechnologyTagsChange: (value: string) => void;
  onPublishDateChange: (value: string) => void;
};

const categoryOptions = ["Technical", "General", "Documentation"] as const;

export function BlogEditorMetaPanel({
  title,
  slug,
  category,
  titleImage,
  technologyTags,
  publishDate,
  onTitleChange,
  onSlugChange,
  onCategoryChange,
  onTitleImageChange,
  onTechnologyTagsChange,
  onPublishDateChange,
}: BlogEditorMetaPanelProps) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Metadata
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[var(--color-text)]">
            Post details
          </h2>
        </div>

        <span className="rounded-full border border-[var(--color-border)] bg-white/50 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/55">
          Required
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
            placeholder="Write the post title"
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
            placeholder="post-url-slug"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Publish Date
          </span>
          <input
            type="date"
            value={publishDate}
            onChange={(event) => onPublishDateChange(event.target.value)}
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Title Image
          </span>
          <input
            value={titleImage}
            onChange={(event) => onTitleImageChange(event.target.value)}
            placeholder="Cover image URL or upload picker"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Technology Tags
          </span>
          <input
            value={technologyTags}
            onChange={(event) => onTechnologyTagsChange(event.target.value)}
            placeholder="React, Next.js, TypeScript"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categoryOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onCategoryChange(option)}
            className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors ${
              category === option
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
